from __future__ import annotations

import logging

from app.rag.llm import generate_answer
from app.rag.retriever import retrieve_context

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Tony Hoang's AI portfolio assistant.
Answer only using the provided context about Tony.
If the context does not contain the answer, say you do not have that information yet.
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
        return "I do not have enough information yet to answer that. Tony can add this detail to the assistant knowledge base."

    return (
        "I can answer from Tony's portfolio knowledge base, but the chat model is not ready yet. "
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
                "Answer the visitor using only the context."
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
