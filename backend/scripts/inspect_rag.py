from __future__ import annotations

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

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
        metadata = json.dumps(chunk["metadata"], sort_keys=True)
        print(f"[{chunk['source_name']} #{chunk['chunk_index']}] {chunk['char_count']} chars")
        print(f"  metadata: {metadata}")
        print(f"  {preview}")
        print()


if __name__ == "__main__":
    main()
