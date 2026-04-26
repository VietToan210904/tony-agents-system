# Backend

Run the FastAPI app:

```powershell
uvicorn main:app --reload
```

RAG assistant setup:

```powershell
pip install -r requirements.txt
docker compose up -d postgres
python scripts/ingest_rag.py
uvicorn main:app --reload
```

The backend expects:

- OpenAI chat when `CHAT_PROVIDER=openai` and `OPENAI_API_KEY` is set
- Ollama/vLLM OpenAI-compatible chat when `CHAT_PROVIDER=openai_compatible`
- OpenAI embeddings by default with `text-embedding-3-small`
- Optional local Qwen embeddings later with `Qwen/Qwen3-Embedding-0.6B`
- PostgreSQL at `postgresql://postgres:postgres@localhost:5432/tony_portfolio`

Copy `.env.example` if you want to change those defaults.
