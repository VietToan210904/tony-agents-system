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


def env_stripped(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


@dataclass(frozen=True)
class Settings:
    database_url: str = env_stripped(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/tony_portfolio",
    )
    chat_provider: str = os.getenv("CHAT_PROVIDER", "openai_compatible").lower()
    openai_api_key: str = env_stripped("OPENAI_API_KEY")
    openai_base_url: str = env_stripped("OPENAI_BASE_URL", "https://api.openai.com/v1")
    chat_base_url: str = env_stripped("CHAT_BASE_URL", env_stripped("VLLM_BASE_URL", "http://localhost:11434/v1"))
    chat_api_key: str = env_stripped("CHAT_API_KEY", env_stripped("VLLM_API_KEY", "ollama"))
    chat_model: str = env_stripped("CHAT_MODEL", env_stripped("VLLM_MODEL", default_chat_model()))
    cors_allow_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv(
            "CORS_ALLOW_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    )
    admin_token: str = env_stripped("ADMIN_TOKEN")
    embedding_provider: str = os.getenv("EMBEDDING_PROVIDER", "openai")
    embedding_base_url: str = env_stripped("EMBEDDING_BASE_URL", "http://localhost:8002/v1")
    embedding_api_key: str = env_stripped("EMBEDDING_API_KEY") or env_stripped("OPENAI_API_KEY", "local-token")
    embedding_model: str = env_stripped("EMBEDDING_MODEL", default_embedding_model())
    embedding_dimensions: int = int(os.getenv("EMBEDDING_DIMENSIONS", default_embedding_dimensions()))
    rag_top_k: int = int(os.getenv("RAG_TOP_K", "6"))
    allow_dev_fallback: bool = os.getenv("ALLOW_DEV_FALLBACK", "true").lower() == "true"
    rate_limit_enabled: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
    chat_rate_limit_per_minute: int = int(os.getenv("CHAT_RATE_LIMIT_PER_MINUTE", "6"))
    chat_rate_limit_per_hour: int = int(os.getenv("CHAT_RATE_LIMIT_PER_HOUR", "60"))
    rate_limit_salt: str = env_stripped("RATE_LIMIT_SALT", env_stripped("ADMIN_TOKEN", "portfolio-rate-limit-v1"))


settings = Settings()
