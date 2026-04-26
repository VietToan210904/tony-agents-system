from __future__ import annotations

import re
from collections import Counter
from typing import Any

from app.config import settings
from app.rag.chunking import chunk_text
from app.rag.database import search_chunks
from app.rag.embeddings import embed_texts
from app.rag.ingest import load_source_documents

TOKEN_PATTERN = re.compile(r"[a-zA-Z0-9+#.\-]+")


def _tokens(text: str) -> set[str]:
    return {token.lower() for token in TOKEN_PATTERN.findall(text) if len(token) > 2}


def _fallback_search(question: str, limit: int) -> list[dict[str, Any]]:
    query_tokens = _tokens(question)
    candidates: list[dict[str, Any]] = []

    for source_name, source_type, content in load_source_documents():
        for index, chunk in enumerate(chunk_text(content)):
            chunk_tokens = _tokens(chunk)
            overlap = query_tokens & chunk_tokens
            score = len(overlap) / max(len(query_tokens), 1)
            if score:
                candidates.append(
                    {
                        "chunk_text": chunk,
                        "metadata": {"source": source_name, "chunk_index": index},
                        "source_name": source_name,
                        "source_type": source_type,
                        "score": score,
                    }
                )

    if not candidates:
        all_chunks = [
            {
                "chunk_text": chunk,
                "metadata": {"source": source_name, "chunk_index": index},
                "source_name": source_name,
                "source_type": source_type,
                "score": 0.0,
            }
            for source_name, source_type, content in load_source_documents()
            for index, chunk in enumerate(chunk_text(content))
        ]
        return all_chunks[:limit]

    weighted = Counter()
    for candidate in candidates:
        weighted[id(candidate)] = candidate["score"]
    return sorted(candidates, key=lambda item: item["score"], reverse=True)[:limit]


async def retrieve_context(question: str) -> tuple[list[dict[str, Any]], bool]:
    try:
        embedding = (await embed_texts([question], input_type="query"))[0]
        return search_chunks(embedding, limit=settings.rag_top_k), False
    except Exception:
        if not settings.allow_dev_fallback:
            raise
        return _fallback_search(question, settings.rag_top_k), True
