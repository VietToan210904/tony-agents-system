from __future__ import annotations

from pathlib import Path

from app.rag.chunking import chunk_text
from app.rag.database import init_database, replace_chunks
from app.rag.embeddings import embed_texts

SOURCE_DIR = Path(__file__).resolve().parents[2] / "rag_sources"


def load_source_documents() -> list[tuple[str, str, str]]:
    documents: list[tuple[str, str, str]] = []
    for path in sorted(SOURCE_DIR.glob("*.md")):
        documents.append((path.stem, "markdown", path.read_text(encoding="utf-8")))
    return documents


async def ingest_sources() -> dict[str, int]:
    init_database()
    summary: dict[str, int] = {}

    for source_name, source_type, content in load_source_documents():
        chunks = chunk_text(content)
        embeddings = await embed_texts(chunks, input_type="document")
        chunk_payload = [
            (chunk, embedding, {"source": source_name, "chunk_index": index})
            for index, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]
        summary[source_name] = replace_chunks(source_name, source_type, chunk_payload)

    return summary
