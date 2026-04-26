# GCP Staging Deployment

This deployment uses OpenAI for chat and embeddings, so production does not need Ollama, vLLM, Hugging Face, or a GPU VM.

## Architecture

```text
Cloud Run frontend
  -> Cloud Run backend
      -> Cloud SQL PostgreSQL + pgvector
      -> OpenAI API for chat and embeddings
```

CI/CD runs from GitHub Actions on pushes to `main`.

## One-Time GCP Setup

Set local variables:

```powershell
$PROJECT_ID="tony-portfolio-prod"
$REGION="australia-southeast1"
$DB_INSTANCE="tony-portfolio-db-staging"
$DB_NAME="tony_portfolio"
$DB_USER="portfolio_app"
$REPO="portfolio-repo"
$BACKEND_SERVICE="portfolio-backend-staging"
$FRONTEND_SERVICE="portfolio-frontend-staging"
$INGEST_JOB="portfolio-rag-ingest-staging"
$GITHUB_REPO="VietToan210904/tony-agents-system"
gcloud config set project $PROJECT_ID
```
wXuKhmOvpTUH7fNZCG3cFJxtirYqMQ1V db

sqDd8BS9onzUN2r1PcOKjwiLHbJXxEe6YhtZT0lm admintoken

H3EmDtKgicOTnsloRkj7aNpeU9S2rXqb postgres

1095419944309 proj number

(.venv) PS C:\Users\tonyh_yxuq8za\tony-agents-system> $WIF_PROVIDER
projects/1095419944309/locations/global/workloadIdentityPools/github-pool/providers/github-provider

Enable APIs:

```powershell
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable iamcredentials.googleapis.com
```

Create Artifact Registry:

```powershell
gcloud artifacts repositories create $REPO `
  --repository-format=docker `
  --location=$REGION
```

Create Cloud SQL:

```powershell
gcloud sql instances create $DB_INSTANCE `
  --database-version=POSTGRES_16 `
  --edition=ENTERPRISE `
  --tier=db-f1-micro `
  --region=$REGION `
  --storage-size=10GB

gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE

gcloud sql users create $DB_USER `
  --instance=$DB_INSTANCE `
  --password="REPLACE_WITH_STRONG_PASSWORD"
```

Create the `pgvector` extension once with the Cloud SQL query tool or `psql`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Create Secret Manager values. The `DATABASE_URL` uses the Cloud SQL Unix socket path:

```text
postgresql://portfolio_app:REPLACE_WITH_PASSWORD@/tony_portfolio?host=/cloudsql/tony-portfolio-prod:australia-southeast1:tony-portfolio-db-staging
```

Create secrets:

```powershell
gcloud secrets create portfolio-database-url --replication-policy=automatic
gcloud secrets create portfolio-openai-api-key --replication-policy=automatic
gcloud secrets create portfolio-admin-token --replication-policy=automatic
```

Add secret versions:

```powershell
Set-Content -Path .tmp_database_url.txt -Value "REPLACE_WITH_DATABASE_URL"
Set-Content -Path .tmp_openai_key.txt -Value "REPLACE_WITH_OPENAI_API_KEY"
Set-Content -Path .tmp_admin_token.txt -Value "REPLACE_WITH_LONG_RANDOM_ADMIN_TOKEN"

gcloud secrets versions add portfolio-database-url --data-file=.tmp_database_url.txt
gcloud secrets versions add portfolio-openai-api-key --data-file=.tmp_openai_key.txt
gcloud secrets versions add portfolio-admin-token --data-file=.tmp_admin_token.txt

Remove-Item .tmp_database_url.txt, .tmp_openai_key.txt, .tmp_admin_token.txt
```

## Service Accounts and IAM

Create service accounts:

```powershell
gcloud iam service-accounts create portfolio-runtime-sa `
  --display-name="Portfolio Cloud Run runtime"

gcloud iam service-accounts create github-deployer-sa `
  --display-name="GitHub Actions portfolio deployer"
```

Set service account emails:

```powershell
$RUNTIME_SA="portfolio-runtime-sa@$PROJECT_ID.iam.gserviceaccount.com"
$DEPLOYER_SA="github-deployer-sa@$PROJECT_ID.iam.gserviceaccount.com"
```

Grant runtime permissions:

```powershell
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$RUNTIME_SA" `
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$RUNTIME_SA" `
  --role="roles/secretmanager.secretAccessor"
```

Grant deployer permissions:

```powershell
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$DEPLOYER_SA" `
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$DEPLOYER_SA" `
  --role="roles/artifactregistry.writer"

gcloud iam service-accounts add-iam-policy-binding $RUNTIME_SA `
  --member="serviceAccount:$DEPLOYER_SA" `
  --role="roles/iam.serviceAccountUser"
```

## GitHub Actions Authentication

Create Workload Identity Federation:

```powershell
$PROJECT_NUMBER=(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

gcloud iam workload-identity-pools create github-pool `
  --project=$PROJECT_ID `
  --location=global `
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github-provider `
  --project=$PROJECT_ID `
  --location=global `
  --workload-identity-pool=github-pool `
  --display-name="GitHub provider" `
  --issuer-uri="https://token.actions.githubusercontent.com" `
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" `
  --attribute-condition="attribute.repository=='$GITHUB_REPO'"

gcloud iam service-accounts add-iam-policy-binding $DEPLOYER_SA `
  --project=$PROJECT_ID `
  --role="roles/iam.workloadIdentityUser" `
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/$GITHUB_REPO"
```

The provider value for GitHub is:

```text
projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

## GitHub Repository Variables

In GitHub, go to:

```text
Settings -> Secrets and variables -> Actions -> Variables
```

Add:

```text
GCP_PROJECT_ID=tony-portfolio-prod
GCP_REGION=australia-southeast1
GCP_AR_REPOSITORY=portfolio-repo
GCP_BACKEND_SERVICE=portfolio-backend-staging
GCP_FRONTEND_SERVICE=portfolio-frontend-staging
GCP_INGEST_JOB=portfolio-rag-ingest-staging
GCP_RUNTIME_SERVICE_ACCOUNT=portfolio-runtime-sa@tony-portfolio-prod.iam.gserviceaccount.com
GCP_DEPLOYER_SERVICE_ACCOUNT=github-deployer-sa@tony-portfolio-prod.iam.gserviceaccount.com
GCP_CLOUD_SQL_INSTANCE=tony-portfolio-prod:australia-southeast1:tony-portfolio-db-staging
GCP_WORKLOAD_IDENTITY_PROVIDER=projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

No OpenAI key should be stored in GitHub. It lives in GCP Secret Manager.

## Deploy

Push to `main` or run the workflow manually:

```text
Actions -> Deploy staging to GCP -> Run workflow
```

The workflow will:

1. Build and push the backend image.
2. Deploy the backend to Cloud Run.
3. Read the backend URL.
4. Build the frontend with `VITE_API_BASE_URL`.
5. Deploy the frontend to Cloud Run.
6. Update backend CORS to the frontend URL.
7. Deploy and execute the RAG ingestion job.
8. Smoke test `/api/health` and `/api/chat`.

## Verify

After deploy, test:

```powershell
$BACKEND_URL="REPLACE_WITH_BACKEND_URL"

Invoke-RestMethod "$BACKEND_URL/api/health"

Invoke-RestMethod `
  -Method Post `
  -Uri "$BACKEND_URL/api/chat" `
  -ContentType "application/json" `
  -Body '{"message":"What AI experience does Tony have?"}' `
  | ConvertTo-Json -Depth 4
```

Successful production RAG should show:

```json
"used_retrieval_fallback": false,
"used_llm_fallback": false
```
