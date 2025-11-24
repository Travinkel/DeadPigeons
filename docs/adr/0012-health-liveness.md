# ADR-0012: Health Endpoint Stays Up Without DB Dependency

## Status
Accepted

## Context
Integration tests in CI returned 500 on `/health` because startup attempted to build DbContext with a missing/invalid connection string before the TestContainers configuration applied. For exam and ops, we only need a liveness probe, not a DB dependency.

## Decision
- Keep `/health` and `/api/health` as pure liveness endpoints (no database or service calls) returning HTTP 200 with a simple payload.
- Rely on application startup to handle migrations/seeding elsewhere; health must not fail because of DB connectivity during tests.

## Consequences
- Integration tests can rely on `/health` returning 200 even if DB is not reachable in CI.
- Liveness checks are stable; DB/seed failures surface in functional tests and application logs, not via `/health`.
