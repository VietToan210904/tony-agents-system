from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Profile(BaseModel):
    name: str
    role: str
    tagline: str


app = FastAPI(title="Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/profile", response_model=Profile)
def profile() -> Profile:
    return Profile(
        name="Tony Hoang",
        role="AI Engineer / AI Researcher / Data Scientist / Software Engineer",
        tagline="Xin Chao, I'm",
    )
