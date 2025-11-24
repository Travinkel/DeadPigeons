# ADR-0018: Deterministic Active Game Retrieval in Tests

## Status
Accepted

## Context
Integration tests against `/api/games/active` occasionally returned 404 or produced non-JSON responses when no active game existed in a fresh database. Seed data may not guarantee an active game at the moment of the request. Tests that create and immediately complete games expect an active game to be available. When the DB is clean or seeds differ (e.g., PR base branch), the active lookup fails, leading to 404 and downstream JSON parse errors.

## Decision
- `GameService.GetActiveAsync` now promotes the next pending game (ordered by year/week) to Active when no active game exists, setting `StartedAt` and persisting the change.
- Integration tests for games now assert creation success before completion to fail fast if promotion/creation fails.

## Consequences
- `/api/games/active` becomes deterministic in clean/seeded test environments, eliminating flaky 404s and parse errors.
- Tests surface failures at create/promotion instead of returning invalid JSON on completion.
- Production behavior remains unchanged except that calling GetActive when no active game exists will activate the next pending game (closest by year/week).
