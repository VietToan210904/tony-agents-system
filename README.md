# Portfolio Full Stack App with AI Agents integrated

React + TypeScript + Tailwind CSS frontend with a FastAPI backend and a local RAG assistant.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Replace `frontend/public/portrait.png` with your own portrait photo.
Add a faded Vietnamese place background as `frontend/public/vietnam-background.jpg`.

## Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## AI Assistant RAG

The assistant uses FastAPI, PostgreSQL, pgvector, OpenAI embeddings by default, and a switchable chat provider.

Current chat options:

- OpenAI: set `CHAT_PROVIDER=openai`, `OPENAI_API_KEY`, and `CHAT_MODEL=gpt-5.4-mini`
- Ollama/vLLM: set `CHAT_PROVIDER=openai_compatible`, `CHAT_BASE_URL`, `CHAT_API_KEY`, and `CHAT_MODEL`
- OpenAI embeddings: set `EMBEDDING_PROVIDER=openai`, `EMBEDDING_MODEL=text-embedding-3-small`, and `EMBEDDING_DIMENSIONS=1536`
- Local Qwen embeddings for later self-hosting: set `EMBEDDING_PROVIDER=local`, `EMBEDDING_MODEL=Qwen/Qwen3-Embedding-0.6B`, and `EMBEDDING_DIMENSIONS=1024`

Start PostgreSQL with pgvector:

```powershell
docker compose up -d postgres
```

For local Ollama, make sure `llama3.1:8b` is available:

```powershell
ollama pull llama3.1:8b
ollama serve
```

Ingest Tony's knowledge base into Postgres:

```powershell
cd backend
python scripts/ingest_rag.py
```

Then run the backend:

```powershell
uvicorn main:app --reload
```

The personal knowledge files live in `backend/rag_sources`. Update those files and rerun ingestion whenever Tony's CV, projects, skills, contact information, or embedding model changes.

The chat API is rate limited by default to protect OpenAI API usage. Configure it with `RATE_LIMIT_ENABLED`, `CHAT_RATE_LIMIT_PER_MINUTE`, and `CHAT_RATE_LIMIT_PER_HOUR`.

## GCP Deployment

The GCP staging deployment runbook is in `docs/GCP_DEPLOYMENT.md`.
