# ADR 0005 – Containerisation and Distributed Runtime

## Status

Accepted

## Context

- The system is composed of separate concerns: reverse proxy, API, client, and database.
- CI and production deploy containers; Testcontainers backs integration tests.
- We already adopted Docker in the walking skeleton for parity (see ADR 0004 — Docker parity).

## Decision

Run all services as containers in CI and production. Treat container images as the deployable artifacts.

- Proxy (Nginx), API (.NET), and DB (PostgreSQL) are distinct containers.
- Client is built to static assets, served by the proxy or a static host.
- Local development may run API/client natively; Docker Compose provides parity for DB/proxy.

## Alternatives Considered

1. Bare‑metal processes in production

- Pros: potentially simpler infra.
- Cons: loses parity and reproducibility; harder to standardize security baselines.

2. Single container for all services

- Pros: fewer moving parts.
- Cons: breaks separation of concerns; harder scaling and fault isolation; larger blast radius.

## Consequences

- DX: Clear run modes; compose for local parity; faster onboarding.
- CI: Images are built once; Testcontainers provides realistic DB; smoke tests validate routes.
- Security: Explicit trust boundaries at container edges; easier to reason about headers, CORS, and secrets.
- Reproducibility: Versioned images and pinned tags reduce drift.

## Follow‑ups

- Architecture Overview: add a "Distributed Architecture & Containerisation Strategy" section (done).
- README + Running the Project: add compose quickstarts (done).
- CI & Quality: add "Container parity" subsection (planned here; update page).
- Deploy How‑to: clarify multi‑container structure: proxy, API, migrations as separate units.

## References

- ADR 0004 — Walking Skeleton uses Docker (compose) for parity
- CI & Quality — container parity, Testcontainers
- Deploy How‑to — Nginx + API + migrations separation
