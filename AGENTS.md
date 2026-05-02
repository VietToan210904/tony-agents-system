# Repository Guidelines

## Project Structure & Module Organization

This repository is a full-stack portfolio app. `frontend/` contains the Vite React TypeScript UI, with app code in `frontend/src/` and static assets in `frontend/public/`. `backend/` contains the FastAPI service: `backend/main.py` defines routes, `backend/app/` holds configuration, schemas, rate limiting, and RAG logic, and `backend/app/rag/` contains ingestion, retrieval, embeddings, and database access. RAG source documents live in `backend/rag_sources/`; update them before rerunning ingestion. Database setup is in `backend/db/schema.sql`. Deployment notes live in `docs/`, and GCP staging automation is in `.github/workflows/deploy-staging.yml`.

## Build, Test, and Development Commands

- `cd frontend && npm install`: install frontend dependencies.
- `cd frontend && npm run dev`: start Vite on port `5173`; `/api` proxies to `http://127.0.0.1:8000`.
- `cd frontend && npm run build`: type-check with `tsc -b` and create the production Vite build.
- `docker compose up -d postgres`: start local PostgreSQL with pgvector.
- `cd backend && pip install -r requirements.txt`: install backend dependencies.
- `cd backend && python scripts/ingest_rag.py`: ingest `backend/rag_sources/` into Postgres.
- `cd backend && uvicorn main:app --reload`: run the FastAPI API locally.

## Coding Style & Naming Conventions

Frontend code uses TypeScript, React function components, double quotes, semicolons, and two-space indentation. Keep component and hook names in `PascalCase` and `useCamelCase`, respectively. CSS uses BEM-like class names such as `assistant__panel` and state classes such as `is-open`. Backend Python uses four-space indentation, type hints, dataclasses for settings, and snake_case module/function names.

## Testing Guidelines

No dedicated test framework or test script is currently configured. Before submitting changes, at minimum run `npm run build` for frontend changes and manually verify backend endpoints with `uvicorn main:app --reload`, `/api/health`, and relevant `/api/chat` scenarios. If adding tests, prefer colocated frontend tests under `frontend/src/` and backend tests under `backend/tests/`.

## Commit & Pull Request Guidelines

Git history uses short imperative commits, for example `Add chat API rate limiting` and `Use env vars file for backend deploy`. Keep commits focused on one behavioral change. Pull requests should include a concise summary, validation commands run, linked issue or deployment context when relevant, and screenshots or short recordings for visible UI changes.

## Security & Configuration Tips

Do not commit real secrets from `.env` files. Configure chat, embeddings, CORS, admin auth, and rate limits through environment variables documented in `README.md` and `backend/README.md`. Re-ingest RAG sources after changing profile, project, skills, contact, resume, or embedding settings.
