from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import admin, chat, health, profile, root

router = APIRouter()
router.include_router(root.router)

api_router = APIRouter(prefix="/api")
api_router.include_router(health.router)
api_router.include_router(profile.router)
api_router.include_router(chat.router)
api_router.include_router(admin.router)

router.include_router(api_router)
