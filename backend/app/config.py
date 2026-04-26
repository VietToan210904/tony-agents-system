from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[2]

load_dotenv(ROOT_DIR / ".env")
load_dotenv(ROOT_DIR / "backend" / ".env", override=True)
os.environ.setdefault("HF_HOME", str(ROOT_DIR / ".cache" / "huggingface"))
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")


def default_chat_model() -> str:
    if os.getenv("CHAT_PROVIDER", "openai_compatible").lower() == "openai":
        return "gpt-5.4-mini"
    return "llama3.1:8b"


def default_embedding_model() -> str:
    if os.getenv("EMBEDDING_PROVIDER", "openai").lower() == "openai":
        return "text-embedding-3-small"
    return "Qwen/Qwen3-Embedding-0.6B"


def default_embedding_dimensions() -> str:
    if os.getenv("EMBEDDING_PROVIDER", "openai").lower() == "openai":
        return "1536"
    return "1024"


@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/tony_portfolio",
    )
    chat_provider: str = os.getenv("CHAT_PROVIDER", "openai_compatible").lower()
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    chat_base_url: str = os.getenv("CHAT_BASE_URL", os.getenv("VLLM_BASE_URL", "http://localhost:11434/v1"))
    chat_api_key: str = os.getenv("CHAT_API_KEY", os.getenv("VLLM_API_KEY", "ollama"))
    chat_model: str = os.getenv("CHAT_MODEL", os.getenv("VLLM_MODEL", default_chat_model()))
    cors_allow_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    )
    admin_token: str = os.getenv("ADMIN_TOKEN", "")
    embedding_provider: str = os.getenv("EMBEDDING_PROVIDER", "openai")
    embedding_base_url: str = os.getenv("EMBEDDING_BASE_URL", "http://localhost:8002/v1")
    embedding_api_key: str = os.getenv("EMBEDDING_API_KEY") or os.getenv("OPENAI_API_KEY", "local-token")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", default_embedding_model())
    embedding_dimensions: int = int(os.getenv("EMBEDDING_DIMENSIONS", default_embedding_dimensions()))
    rag_top_k: int = int(os.getenv("RAG_TOP_K", "6"))
    allow_dev_fallback: bool = os.getenv("ALLOW_DEV_FALLBACK", "true").lower() == "true"


settings = Settings()
