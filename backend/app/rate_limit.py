from __future__ import annotations

import hashlib
import logging
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, Request, status

from app.config import settings

logger = logging.getLogger(__name__)

RATE_LIMIT_ROUTE = "/api/chat"
_SCHEMA_READY = False


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


def hash_rate_limit_key(value: str) -> str:
    return hashlib.sha256(f"{settings.rate_limit_salt}:{value}".encode("utf-8")).hexdigest()


def window_start(now: datetime, window_seconds: int) -> datetime:
    if window_seconds == 60:
        return now.replace(second=0, microsecond=0)

    if window_seconds == 3600:
        return now.replace(minute=0, second=0, microsecond=0)

    epoch_seconds = int(now.timestamp())
    floored = epoch_seconds - (epoch_seconds % window_seconds)
    return datetime.fromtimestamp(floored, tz=UTC)


def ensure_rate_limit_schema(conn) -> None:
    global _SCHEMA_READY
    if _SCHEMA_READY:
        return

    with conn.cursor() as cur:
        cur.execute(
            """
            create table if not exists rate_limit_hits (
              key_hash text not null,
              route text not null,
              window_seconds integer not null,
              window_start timestamptz not null,
              request_count integer not null default 0,
              created_at timestamptz not null default now(),
              updated_at timestamptz not null default now(),
              primary key (key_hash, route, window_seconds, window_start)
            )
            """
        )
        cur.execute(
            """
            create index if not exists rate_limit_hits_updated_at_idx
              on rate_limit_hits (updated_at)
            """
        )

    _SCHEMA_READY = True


def increment_window(cur, *, key_hash: str, route: str, window_seconds: int, started_at: datetime) -> int:
    cur.execute(
        """
        insert into rate_limit_hits (key_hash, route, window_seconds, window_start, request_count)
        values (%s, %s, %s, %s, 1)
        on conflict (key_hash, route, window_seconds, window_start)
        do update set
          request_count = rate_limit_hits.request_count + 1,
          updated_at = now()
        returning request_count
        """,
        (key_hash, route, window_seconds, started_at),
    )
    return int(cur.fetchone()[0])


def retry_after_seconds(now: datetime, started_at: datetime, window_seconds: int) -> int:
    retry_at = started_at + timedelta(seconds=window_seconds)
    return max(1, int((retry_at - now).total_seconds()))


def enforce_chat_rate_limit(request: Request) -> None:
    if not settings.rate_limit_enabled:
        return

    import psycopg

    now = datetime.now(UTC)
    client_key = hash_rate_limit_key(get_client_ip(request))
    minute_start = window_start(now, 60)
    hour_start = window_start(now, 3600)

    try:
        with psycopg.connect(settings.database_url, connect_timeout=3) as conn:
            ensure_rate_limit_schema(conn)
            with conn.cursor() as cur:
                cur.execute(
                    "delete from rate_limit_hits where updated_at < now() - interval '2 hours'"
                )
                minute_count = increment_window(
                    cur,
                    key_hash=client_key,
                    route=RATE_LIMIT_ROUTE,
                    window_seconds=60,
                    started_at=minute_start,
                )
                hour_count = increment_window(
                    cur,
                    key_hash=client_key,
                    route=RATE_LIMIT_ROUTE,
                    window_seconds=3600,
                    started_at=hour_start,
                )
    except Exception as exc:
        logger.exception("Rate limiter failed before chat request: %s", exc)
        if settings.allow_dev_fallback:
            return

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The chat assistant is temporarily unavailable. Please try again soon.",
        ) from exc

    retry_after = 0
    if minute_count > settings.chat_rate_limit_per_minute:
        retry_after = retry_after_seconds(now, minute_start, 60)

    if hour_count > settings.chat_rate_limit_per_hour:
        retry_after = max(retry_after, retry_after_seconds(now, hour_start, 3600))

    if retry_after:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many chat requests. Please wait a moment and try again.",
            headers={"Retry-After": str(retry_after)},
        )
