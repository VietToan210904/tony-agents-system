from __future__ import annotations

import logging

from app.rag.llm import generate_answer
from app.rag.retriever import retrieve_context

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Tony Hoang's AI portfolio assistant.
Your only job is to answer questions about Tony Hoang, also known as Bui Viet Toan Hoang.
Only discuss Tony's profile, experience, projects, skills, resume, contact details, and portfolio.
Answer only using the provided context about Tony.
If the context does not contain the answer, say you do not have that information yet.
If the visitor asks for anything unrelated to Tony, politely refuse and say: "I can only answer questions about Tony Hoang's portfolio, experience, projects, skills, or contact details."
Do not provide unrelated coding help, tutorials, homework answers, business advice, general facts, or personal advice.
Be warm, professional, concise, and useful for recruiters, collaborators, and visitors.
RAG means Retrieval-Augmented Generation.
Do not invent degrees, companies, links, dates, awards, or private details."""


def build_context_block(chunks: list[dict]) -> str:
    lines: list[str] = []
    for index, chunk in enumerate(chunks, start=1):
        source = chunk.get("source_name", "profile")
        score = chunk.get("score", 0)
        lines.append(f"[{index}] Source: {source}; relevance: {score:.3f}\n{chunk['chunk_text']}")
    return "\n\n".join(lines)


def fallback_answer(question: str, chunks: list[dict]) -> str:
    context = chunks[0]["chunk_text"] if chunks else ""
    if not context:
        return (
            "I can only answer questions about Tony Hoang's portfolio, experience, projects, "
            "skills, or contact details. I do not have enough Tony-specific information yet to answer that."
        )

    return (
        "I can only help with Tony Hoang's portfolio knowledge base, and the chat model is not ready yet. "
        f"The most relevant information I found is:\n\n{context[:900]}"
    )


async def answer_question(question: str) -> dict:
    chunks, used_retrieval_fallback = await retrieve_context(question)
    context = build_context_block(chunks)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                f"Context about Tony:\n{context}\n\n"
                f"Visitor question: {question}\n\n"
                "If the visitor question is about Tony, answer using only the context. "
                "If it is not about Tony, refuse politely and redirect them to ask about Tony's portfolio, "
                "experience, projects, skills, or contact details. Do not answer from general knowledge."
            ),
        },
    ]

    try:
        answer = await generate_answer(messages)
        used_llm_fallback = False
    except Exception as exc:
        logger.exception("Chat model request failed; using fallback answer: %s", exc)
        answer = fallback_answer(question, chunks)
        used_llm_fallback = True

    return {
        "answer": answer,
        "sources": [
            {
                "source": chunk.get("source_name"),
                "score": round(float(chunk.get("score", 0)), 4),
                "preview": chunk.get("chunk_text", "")[:220],
            }
            for chunk in chunks
        ],
        "used_retrieval_fallback": used_retrieval_fallback,
        "used_llm_fallback": used_llm_fallback,
    }
