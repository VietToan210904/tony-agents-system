from __future__ import annotations

from fastapi import APIRouter

from app.schemas import Profile

router = APIRouter()


@router.get("/profile", response_model=Profile)
def profile() -> Profile:
    return Profile(
        name="Tony Hoang",
        role="AI Engineer / AI Researcher / Data Scientist / Software Engineer",
        tagline="Xin Chao, I'm",
    )
