from __future__ import annotations

import hashlib
import math
import re
from functools import lru_cache

import httpx

from app.config import settings

TOKEN_PATTERN = re.compile(r"[a-zA-Z0-9+#.\-]+")


def _tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_PATTERN.findall(text)]


def dev_fallback_embedding(text: str) -> list[float]:
    """Small lexical hashing fallback for local development without an embedding server."""
    vector = [0.0] * settings.embedding_dimensions
    for token in _tokenize(text):
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = int.from_bytes(digest[:4], "big") % settings.embedding_dimensions
        sign = -1.0 if digest[4] % 2 else 1.0
        vector[index] += sign

    norm = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [value / norm for value in vector]


@lru_cache(maxsize=1)
def get_local_embedding_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(settings.embedding_model)


def embed_texts_locally(texts: list[str], *, input_type: str) -> list[list[float]]:
    model = get_local_embedding_model()
    encode_kwargs = {"normalize_embeddings": True}
    if input_type == "query":
        encode_kwargs["prompt_name"] = "query"

    embeddings = model.encode(texts, **encode_kwargs)
    return [embedding.tolist() for embedding in embeddings]


async def embed_texts(texts: list[str], *, input_type: str = "document") -> list[list[float]]:
    if not texts:
        return []

    if settings.embedding_provider == "local":
        try:
            import asyncio

            return await asyncio.to_thread(embed_texts_locally, texts, input_type=input_type)
        except Exception:
            if not settings.allow_dev_fallback:
                raise
            return [dev_fallback_embedding(text) for text in texts]

    if settings.embedding_provider == "openai":
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{settings.openai_base_url.rstrip('/')}/embeddings",
                    headers={"Authorization": f"Bearer {settings.embedding_api_key}"},
                    json={
                        "model": settings.embedding_model,
                        "input": texts,
                        "dimensions": settings.embedding_dimensions,
                    },
                )
                response.raise_for_status()
                payload = response.json()
                return [item["embedding"] for item in sorted(payload["data"], key=lambda item: item["index"])]
        except Exception:
            if not settings.allow_dev_fallback:
                raise
            return [dev_fallback_embedding(text) for text in texts]

    try:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.post(
                f"{settings.embedding_base_url.rstrip('/')}/embeddings",
                headers={"Authorization": f"Bearer {settings.embedding_api_key}"},
                json={"model": settings.embedding_model, "input": texts},
            )
            response.raise_for_status()
            payload = response.json()
            return [item["embedding"] for item in sorted(payload["data"], key=lambda item: item["index"])]
    except Exception:
        if not settings.allow_dev_fallback:
            raise
        return [dev_fallback_embedding(text) for text in texts]
