from __future__ import annotations

from fastapi import Header, HTTPException, status

from app.config import settings


def require_admin(x_admin_token: str | None = Header(default=None)) -> None:
    if not settings.admin_token:
        return

    if x_admin_token != settings.admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )
