from __future__ import annotations

import re

import httpx

from app.config import settings

THINK_PATTERN = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def strip_thinking(text: str) -> str:
    return THINK_PATTERN.sub("", text).strip()


async def generate_answer(messages: list[dict[str, str]]) -> str:
    if settings.chat_provider == "openai":
        return await generate_openai_answer(messages)
    return await generate_openai_compatible_answer(messages)


async def generate_openai_answer(messages: list[dict[str, str]]) -> str:
    system_message = next((message["content"] for message in messages if message["role"] == "system"), "")
    input_messages = [
        {"role": message["role"], "content": message["content"]}
        for message in messages
        if message["role"] != "system"
    ]

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{settings.openai_base_url.rstrip('/')}/responses",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.chat_model,
                "instructions": system_message,
                "input": input_messages,
                "max_output_tokens": 420,
            },
        )
        response.raise_for_status()
        payload = response.json()
        return strip_thinking(extract_response_text(payload))


def extract_response_text(payload: dict) -> str:
    if payload.get("output_text"):
        return str(payload["output_text"])

    parts: list[str] = []
    for item in payload.get("output", []):
        if item.get("type") != "message":
            continue
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and content.get("text"):
                parts.append(str(content["text"]))

    return "\n".join(parts).strip()


async def generate_openai_compatible_answer(messages: list[dict[str, str]]) -> str:
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{settings.chat_base_url.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.chat_api_key}",
            },
            json={
                "model": settings.chat_model,
                "messages": messages,
                "temperature": 0.25,
                "top_p": 0.9,
                "max_tokens": 420,
                "extra_body": {"top_k": 40},
            },
        )
        response.raise_for_status()
        payload = response.json()
        return strip_thinking(payload["choices"][0]["message"]["content"])
