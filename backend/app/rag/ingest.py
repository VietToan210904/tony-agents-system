from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.rag.chunking import chunk_text
from app.rag.database import init_database, replace_chunks
from app.rag.embeddings import embed_texts

SOURCE_DIR = Path(__file__).resolve().parents[2] / "rag_sources"
logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class SourcePage:
    page_number: int | None
    text: str


@dataclass(frozen=True)
class SourceDocument:
    source_name: str
    source_type: str
    file_name: str
    pages: tuple[SourcePage, ...]


def _normalize_pdf_text(text: str) -> str:
    lines: list[str] = []
    previous_was_blank = False

    for raw_line in text.replace("\x00", "").splitlines():
        line = re.sub(r"\s+", " ", raw_line).strip()
        if not line:
            if lines and not previous_was_blank:
                lines.append("")
            previous_was_blank = True
            continue

        lines.append(line)
        previous_was_blank = False

    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()


def _load_markdown_document(path: Path) -> SourceDocument:
    return SourceDocument(
        source_name=path.stem,
        source_type="markdown",
        file_name=path.name,
        pages=(SourcePage(page_number=None, text=path.read_text(encoding="utf-8")),),
    )


def _load_pdf_document(path: Path) -> SourceDocument | None:
    from pypdf import PdfReader

    try:
        reader = PdfReader(str(path))
    except Exception as exc:
        logger.warning("Skipping PDF %s because it could not be read: %s", path.name, exc)
        return None

    pages: list[SourcePage] = []
    for page_number, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
        except Exception as exc:
            logger.warning("Skipping page %s of %s: %s", page_number, path.name, exc)
            continue

        cleaned = _normalize_pdf_text(text)
        if cleaned:
            pages.append(SourcePage(page_number=page_number, text=cleaned))

    if not pages:
        logger.warning("Skipping PDF %s because it has no extractable text", path.name)
        return None

    return SourceDocument(
        source_name=f"{path.stem}_pdf",
        source_type="pdf",
        file_name=path.name,
        pages=tuple(pages),
    )


def load_source_documents() -> list[SourceDocument]:
    documents: list[SourceDocument] = []
    for path in sorted(SOURCE_DIR.iterdir()):
        if not path.is_file():
            continue

        if path.suffix.lower() == ".md":
            documents.append(_load_markdown_document(path))
            continue

        if path.suffix.lower() == ".pdf":
            document = _load_pdf_document(path)
            if document:
                documents.append(document)

    return documents


def build_source_chunks(document: SourceDocument) -> list[tuple[str, dict[str, Any]]]:
    chunks: list[tuple[str, dict[str, Any]]] = []

    for page in document.pages:
        for chunk in chunk_text(page.text):
            metadata: dict[str, Any] = {
                "source": document.source_name,
                "source_type": document.source_type,
                "file_name": document.file_name,
                "chunk_index": len(chunks),
            }

            if page.page_number is not None:
                metadata["page_start"] = page.page_number
                metadata["page_end"] = page.page_number

            chunks.append((chunk, metadata))

    return chunks


async def ingest_sources() -> dict[str, int]:
    init_database()
    summary: dict[str, int] = {}

    for document in load_source_documents():
        chunks = build_source_chunks(document)
        chunk_texts = [chunk for chunk, _metadata in chunks]
        embeddings = await embed_texts(chunk_texts, input_type="document")
        chunk_payload = [
            (chunk, embedding, metadata)
            for (chunk, metadata), embedding in zip(chunks, embeddings)
        ]
        summary[document.source_name] = replace_chunks(
            document.source_name,
            document.source_type,
            chunk_payload,
        )

    return summary
