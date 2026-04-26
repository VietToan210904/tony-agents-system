from __future__ import annotations

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.rag.database import get_ingestion_summary, list_chunks


def main() -> None:
    print("RAG ingestion summary")
    print("=" * 72)
    for item in get_ingestion_summary():
        print(f"- {item['source_name']}: {item['chunk_count']} chunks ({item['source_type']})")

    print()
    print("Chunks")
    print("=" * 72)
    for chunk in list_chunks(limit=100):
        preview = " ".join(chunk["preview"].split())
        print(f"[{chunk['source_name']} #{chunk['chunk_index']}] {chunk['char_count']} chars")
        print(f"  {preview}")
        print()


if __name__ == "__main__":
    main()
