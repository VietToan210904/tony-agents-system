from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.rag.ingest import ingest_sources


async def main() -> None:
    summary = await ingest_sources()
    print("RAG ingestion complete")
    for source, count in summary.items():
        print(f"- {source}: {count} chunks")


if __name__ == "__main__":
    asyncio.run(main())
