from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import require_admin
from app.rag.database import get_ingestion_summary, list_chunks
from app.rag.ingest import ingest_sources

router = APIRouter(dependencies=[Depends(require_admin)])


@router.post("/admin/ingest")
async def ingest() -> dict[str, dict[str, int]]:
    return {"sources": await ingest_sources()}


@router.post("/ingest")
async def ingest_legacy() -> dict[str, dict[str, int]]:
    return {"sources": await ingest_sources()}


@router.get("/rag/summary")
def rag_summary() -> dict:
    return {"sources": get_ingestion_summary(), "chunks": list_chunks(limit=100)}
