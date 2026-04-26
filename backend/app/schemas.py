from __future__ import annotations

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1200)


class ChatSource(BaseModel):
    source: str | None
    score: float
    preview: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
    used_retrieval_fallback: bool = False
    used_llm_fallback: bool = False
