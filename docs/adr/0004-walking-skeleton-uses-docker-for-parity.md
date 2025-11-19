# ADR 0004 – Walking Skeleton uses Docker (compose) for parity

## Status

Accepted

## Context

- The project is a distributed web app (API, client, DB, and optional reverse proxy).
- CI and deployment environments run services as containers.
- Early environment parity reduces "works on my machine" issues and clarifies trust boundaries for networking and security.
- However, Day‑1 friction must remain low for rapid iteration on the walking skeleton.

## Decision

Adopt Docker Compose for the walking skeleton to provide a minimal, reproducible local topology.

- Compose includes at least PostgreSQL (and optionally Nginx proxy later).
- The API and client MAY still be run via `dotnet run` and `npm run dev` against the compose DB.
- CI remains the ultimate gate; local compose mirrors CI topology where feasible.

### Minimal compose (example)

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: deadpigeons
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
  # Optional: reverse proxy (Nginx) layered in subsequent milestones
```

## Alternatives Considered

1. No Docker in D1 (local tools only)

- Pros: lowest friction; fastest initial boot.
- Cons: parity gaps with CI/deploy; more setup drift.

2. Full Docker for all services from D1

- Pros: maximum parity from day one.
- Cons: higher initial friction; slower feedback if image builds are required for every change.

## Consequences

### Positive

- Parity with CI/deploy for DB and (optionally) proxy.
- Clear trust boundaries for networking and security evidence.
- Easier onboarding via `docker compose up`.

### Negative

- Requires Docker Desktop locally.
- Some developers may prefer local Postgres without containers.

## Risks & Mitigations

- Risk: Compose adds overhead on weaker machines.
  - Mitigation: Keep images minimal; allow local Postgres fallback.
- Risk: Confusion between local and compose connection strings.
  - Mitigation: Document env vars and defaults in README and Setup Database.

## Follow‑up Actions

- Document compose quickstart in README and Running the Project (done).
- Wire CI to use Testcontainers for DB to remain close to production.
- Ensure Security Model and Architecture Overview reference trust boundaries.

## Evidence

- README: compose quickstart and run instructions
- Running the Project: compose quickstart with Postgres
- CI & Quality: Testcontainers and smoke checks
