create table if not exists rag_documents (
  id bigserial primary key,
  source_name text not null unique,
  source_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists rag_chunks (
  id bigserial primary key,
  document_id bigint not null references rag_documents(id) on delete cascade,
  chunk_index integer not null,
  chunk_text text not null,
  embedding vector({{EMBEDDING_DIMENSIONS}}) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index if not exists rag_chunks_embedding_hnsw_idx
  on rag_chunks using hnsw (embedding vector_cosine_ops);
