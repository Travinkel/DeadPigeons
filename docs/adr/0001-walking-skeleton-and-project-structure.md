# ADR 0001 – Walking Skeleton and Project Structure

## Status

Accepted

## Context

The project needs a structure that:

- Supports a full-stack application (API + client) from the start.
- Allows continuous integration (CI) to run early and often.
- Matches common .NET + React repo layouts to reduce confusion.
- Keeps the first increment small but end-to-end: build, run, and test.

We want a “walking skeleton”: the smallest possible vertical path through the
system that compiles, runs, and passes CI, before implementing real domain
behaviour.

## Decision

We will:

- Use a **single repository** containing:
  - A .NET Web API solution for the backend.
  - A React + TypeScript app under `client/` for the frontend.
  - Test projects co-located with the backend solution.
- Set up a **walking skeleton** as the first milestone:
  - API boots and serves a minimal endpoint.
  - Client builds and runs.
  - CI runs build and basic tests on each push.

The walking skeleton is not an MVP; it proves that the technical stack and
wiring work end-to-end (build → run → CI) before we add core game features.

## Alternatives Considered

### Separate repositories for API and client

- Pros:
  - Clear separation of concerns.
  - Independent versioning.
- Cons:
  - More CI setup overhead.
  - Harder to manage for a single-developer project.
  - More friction for full-stack refactors.

### Start with API only, add client later

- Pros:
  - Simpler initial setup.
- Cons:
  - Delays verifying full-stack integration.
  - Higher risk that frontend/backend contracts drift.

## Consequences

### Positive

- Early validation that the end-to-end toolchain works.
- Clear place for backend, client, and tests in a single repo.
- CI feedback loop is in place before domain complexity appears.

### Negative

- Initial effort invested into wiring CI before any user-visible features.
- Requires some discipline to keep the walking skeleton minimal and not overload
  it with extra scope.

## Follow-up Actions

- Keep the walking skeleton lean and treat it as an infrastructure milestone.
- Add new ADRs for:
  - Database choice and data access (`0004-use-postgresql-and-ef-core.md`).
  - Client folder and linting (`0002`, `0003`).
- Reflect the structure and rationale in:
  - `docs/explanation/architecture-overview.md`
