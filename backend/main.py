from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.rag.ingest import ingest_sources
from app.rag.database import get_ingestion_summary, list_chunks
from app.rag.service import answer_question
from app.schemas import ChatRequest, ChatResponse


class Profile(BaseModel):
    name: str
    role: str
    tagline: str


app = FastAPI(title="Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_allow_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def require_admin(x_admin_token: str | None = Header(default=None)) -> None:
    if not settings.admin_token:
        return

    if x_admin_token != settings.admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Tony Hoang Portfolio API is running",
        "docs": "/docs",
        "health": "/api/health",
    }


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


@app.post("/api/admin/ingest", dependencies=[Depends(require_admin)])
async def ingest() -> dict[str, dict[str, int]]:
    return {"sources": await ingest_sources()}


@app.post("/api/ingest", dependencies=[Depends(require_admin)])
async def ingest_legacy() -> dict[str, dict[str, int]]:
    return {"sources": await ingest_sources()}


@app.get("/api/rag/summary", dependencies=[Depends(require_admin)])
def rag_summary() -> dict:
    return {"sources": get_ingestion_summary(), "chunks": list_chunks(limit=100)}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> dict:
    return await answer_question(request.message)
