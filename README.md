# Tony Hoang Portfolio

This repository contains my full-stack personal portfolio website, built to present my work as an AI engineer, AI researcher, data scientist, and software developer.

The project is more than a static portfolio. It includes a production-style React frontend, a FastAPI backend, a PostgreSQL + pgvector RAG knowledge base, and an AI assistant that can answer questions about my experience, projects, skills, and contact details.

Live site:

- `https://tonyhoang.space`
- `https://www.tonyhoang.space`

## What This Project Does

- Presents my personal profile with a Vietnam-inspired visual design.
- Showcases my experience, projects, skills, resume, and contact links.
- Provides an AI assistant powered by Retrieval-Augmented Generation.
- Lets visitors ask questions about me directly from the portfolio.
- Uses rate limiting to protect the expensive AI chat endpoint.
- Supports production deployment on Google Cloud Platform with Firebase Hosting and Cloud Run.

## Main Features

- Animated hero section with my portrait, rotating name/title text, and custom motion effects.
- Responsive UI for desktop, tablet, and mobile.
- Project carousel with drag/swipe interaction.
- Animated work experience timeline.
- Running skills marquee for technical and professional skills.
- Contact section with social links and copy-email action.
- Downloadable resume.
- AI assistant chat widget connected to my personal knowledge base.
- Same-domain API routing through Firebase Hosting, so `/api/**` routes to the backend.

## Highlighted Portfolio Projects

- **Hazard and Collision Detection**: Real-time ADAS computer vision system for NSW driving scenarios using YOLOv8m, DeepSORT, CNNs, UNet, OpenCV, PyTorch, CUDA, CVAT, and Roboflow.
- **IMDB Sentiment Analysis**: NLP project comparing machine learning and deep learning models on 50,000+ reviews using NLTK, TF-IDF, Bag-of-Words, Logistic Regression, Naive Bayes, and Neural Networks.
- **Human Activity Recognition**: Computer vision project for detecting and classifying actions from video data using TensorFlow, PyTorch, preprocessing, feature extraction, and deep learning.
- **NBA Rookie Career Longevity**: Data mining project predicting whether NBA rookies remain in the league for five years using feature analysis and classification models.
- **Virtual Library Platform**: Social impact platform providing textbook access for children in disadvantaged areas, built with Firebase, Java, HTML, CSS, and API integrations.

## Work Experience Represented

- **The GrapheneX - Human-centric Artificial Intelligence Centre (HAI)**  
  Research Assistant - LLM Researcher, April 2025 - Present.  
  Focus areas include AI-driven platform systems, RNA vaccine data, multi-agent AI systems, RAG, RLAIF, DPO, prompt engineering, and knowledge extraction for vaccine target discovery.

- **Virtual Library**  
  Head of Programming, April 2023 - November 2023.  
  Led a programming team building a digital library platform for children in disadvantaged areas.

## System Architecture

```text
User Browser
  -> Firebase Hosting / Custom Domain
      -> React + TypeScript Frontend on Cloud Run
      -> /api/** routed to FastAPI Backend on Cloud Run
          -> PostgreSQL + pgvector on Cloud SQL
          -> OpenAI Chat Model
          -> OpenAI Embedding Model
```

The frontend is served through Firebase Hosting and Cloud Run. Firebase handles the custom domain and routes normal website traffic to the frontend service. API traffic under `/api/**` is routed to the FastAPI backend service.

The backend retrieves relevant personal knowledge from PostgreSQL using vector search, sends that context to the configured LLM, and returns an answer with source previews and fallback flags.

## AI Assistant And RAG Pipeline

The assistant uses a Retrieval-Augmented Generation pipeline:

1. Visitor sends a message through the portfolio chat widget.
2. FastAPI receives the request at `/api/chat`.
3. The backend checks the PostgreSQL-backed rate limiter.
4. The question is embedded with the configured embedding provider.
5. PostgreSQL + pgvector retrieves the most relevant knowledge chunks.
6. The selected context is sent to the chat model.
7. The model answers using Tony-specific portfolio knowledge.

Current production defaults:

- Chat provider: OpenAI
- Chat model: `gpt-5.4-mini`
- Embedding provider: OpenAI
- Embedding model: `text-embedding-3-small`
- Vector database: PostgreSQL with pgvector
- Rate limit: 6 chat requests per minute and 60 per hour per visitor IP hash

The code also keeps support for Ollama and vLLM-style OpenAI-compatible backends for future self-hosted LLM experiments.

## Technology Stack

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS concepts and custom CSS
- Lucide React icons
- Responsive CSS animations and scroll reveal effects

Backend:

- FastAPI
- Pydantic
- Python
- PostgreSQL
- pgvector
- psycopg
- OpenAI-compatible chat providers
- OpenAI and local embedding provider support

AI and data:

- Retrieval-Augmented Generation
- Vector search
- OpenAI embeddings
- OpenAI chat completion
- Optional local Qwen embedding support
- Optional Ollama/vLLM-compatible chat support

Infrastructure:

- Google Cloud Run
- Google Cloud SQL for PostgreSQL
- Google Artifact Registry
- Google Secret Manager
- Firebase Hosting
- GitHub Actions CI/CD
- Docker
- Docker Compose for local PostgreSQL

## Repository Structure

```text
frontend/                 React + TypeScript portfolio UI
frontend/src/             Main application code and UI components
frontend/public/          Images, resume, favicon, and static assets

backend/                  FastAPI backend service
backend/app/              Backend configuration, schemas, API routes, RAG, and rate limiting
backend/app/api/routes/   Production-style API route modules
backend/app/rag/          Embeddings, retrieval, ingestion, and database logic
backend/rag_sources/      Personal knowledge files used by the RAG assistant
backend/db/schema.sql     PostgreSQL and pgvector schema
backend/scripts/          RAG ingestion and inspection scripts

.github/workflows/        GitHub Actions deployment workflow
docs/                     Deployment and system notes
firebase.json             Firebase Hosting rewrites for frontend and API routing
docker-compose.yml        Local PostgreSQL + pgvector setup
```

## Deployment

The project is deployed on Google Cloud Platform:

- Frontend service: Cloud Run
- Backend service: Cloud Run
- Database: Cloud SQL PostgreSQL with pgvector
- Secrets: Google Secret Manager
- Container images: Artifact Registry
- Custom domain: Firebase Hosting
- CI/CD: GitHub Actions

GitHub Actions builds and deploys the frontend, backend, and RAG ingestion job. Firebase Hosting handles the public custom domain and rewrites `/api/**` to the backend.

## Local Development Notes

Local development uses the same architecture in smaller form:

```powershell
docker compose up -d postgres
cd backend
python scripts/ingest_rag.py
uvicorn main:app --reload
```

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8000`, so the local frontend can talk to the local FastAPI backend with the same API paths used in production.

## Configuration

Runtime configuration is handled through environment variables and cloud secrets. Important categories include:

- Chat provider and model
- OpenAI API key
- Embedding provider and model
- PostgreSQL database URL
- CORS allowed origins
- Admin token for protected ingestion endpoints
- Chat rate-limit settings

Real secrets are not committed to this repository.

## Security And Cost Controls

- OpenAI API keys and database credentials are stored in Secret Manager for deployment.
- `/api/chat` is rate limited before calling the RAG and LLM pipeline.
- Visitor IPs used for rate limiting are hashed before storage.
- Local fallback behavior can be disabled in production with `ALLOW_DEV_FALLBACK=false`.
- Admin ingestion endpoints are protected with an admin token.

## Personal Knowledge Base

The AI assistant answers from the files in `backend/rag_sources/`, including:

- profile
- experience
- projects
- skills
- contact information
- resume asset

When my profile, experience, skills, projects, or embedding model changes, the RAG data should be re-ingested so the assistant has updated context.
