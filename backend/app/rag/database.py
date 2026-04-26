from __future__ import annotations

from collections.abc import Iterable
from pathlib import Path
from typing import Any

from app.config import settings

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "schema.sql"


def embedding_to_vector_literal(embedding: list[float]) -> str:
    return "[" + ",".join(f"{value:.8f}" for value in embedding) + "]"


def init_database() -> None:
    import psycopg

    schema = SCHEMA_PATH.read_text(encoding="utf-8").replace("{{EMBEDDING_DIMENSIONS}}", str(settings.embedding_dimensions))
    with psycopg.connect(settings.database_url, connect_timeout=3) as conn:
        with conn.cursor() as cur:
            cur.execute("create extension if not exists vector")
            cur.execute(
                """
                select atttypmod
                from pg_attribute
                where attrelid = to_regclass('rag_chunks')
                  and attname = 'embedding'
                  and not attisdropped
                """
            )
            result = cur.fetchone()
            if result and result[0] != settings.embedding_dimensions:
                cur.execute("drop table if exists rag_chunks cascade")
            cur.execute(schema)


def replace_chunks(source_name: str, source_type: str, chunks: Iterable[tuple[str, list[float], dict[str, Any]]]) -> int:
    import psycopg
    from psycopg.types.json import Jsonb

    with psycopg.connect(settings.database_url, connect_timeout=3) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                insert into rag_documents (source_name, source_type)
                values (%s, %s)
                on conflict (source_name)
                do update set source_type = excluded.source_type, updated_at = now()
                returning id
                """,
                (source_name, source_type),
            )
            document_id = cur.fetchone()[0]
            cur.execute("delete from rag_chunks where document_id = %s", (document_id,))

            inserted = 0
            for chunk_index, (chunk_text, embedding, metadata) in enumerate(chunks):
                cur.execute(
                    """
                    insert into rag_chunks (document_id, chunk_index, chunk_text, embedding, metadata)
                    values (%s, %s, %s, %s::vector, %s)
                    """,
                    (
                        document_id,
                        chunk_index,
                        chunk_text,
                        embedding_to_vector_literal(embedding),
                        Jsonb(metadata),
                    ),
                )
                inserted += 1

    return inserted


def search_chunks(query_embedding: list[float], *, limit: int) -> list[dict[str, Any]]:
    import psycopg
    from psycopg.rows import dict_row

    with psycopg.connect(settings.database_url, row_factory=dict_row, connect_timeout=3) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select
                  c.id,
                  c.chunk_text,
                  c.metadata,
                  d.source_name,
                  d.source_type,
                  1 - (c.embedding <=> %s::vector) as score
                from rag_chunks c
                join rag_documents d on d.id = c.document_id
                order by c.embedding <=> %s::vector
                limit %s
                """,
                (
                    embedding_to_vector_literal(query_embedding),
                    embedding_to_vector_literal(query_embedding),
                    limit,
                ),
            )
            return list(cur.fetchall())


def get_ingestion_summary() -> list[dict[str, Any]]:
    import psycopg
    from psycopg.rows import dict_row

    with psycopg.connect(settings.database_url, row_factory=dict_row, connect_timeout=3) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select
                  d.id,
                  d.source_name,
                  d.source_type,
                  count(c.id)::int as chunk_count,
                  d.updated_at
                from rag_documents d
                left join rag_chunks c on c.document_id = d.id
                group by d.id, d.source_name, d.source_type, d.updated_at
                order by d.source_name
                """
            )
            return list(cur.fetchall())


def list_chunks(*, limit: int = 50) -> list[dict[str, Any]]:
    import psycopg
    from psycopg.rows import dict_row

    with psycopg.connect(settings.database_url, row_factory=dict_row, connect_timeout=3) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select
                  c.id,
                  d.source_name,
                  c.chunk_index,
                  left(c.chunk_text, 420) as preview,
                  char_length(c.chunk_text) as char_count,
                  c.metadata,
                  c.created_at
                from rag_chunks c
                join rag_documents d on d.id = c.document_id
                order by d.source_name, c.chunk_index
                limit %s
                """,
                (limit,),
            )
            return list(cur.fetchall())
