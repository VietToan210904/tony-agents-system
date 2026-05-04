from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Tony Hoang Portfolio API is running",
        "docs": "/docs",
        "health": "/api/health",
    }
