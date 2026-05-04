from __future__ import annotations

from fastapi import APIRouter, Request

from app.rag.service import answer_question
from app.rate_limit import enforce_chat_rate_limit
from app.schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: Request, chat_request: ChatRequest) -> dict:
    enforce_chat_rate_limit(request)
    return await answer_question(chat_request.message)
