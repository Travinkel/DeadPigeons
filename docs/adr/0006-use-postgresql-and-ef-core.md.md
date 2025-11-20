# ADR 0005 – Use PostgreSQL and EF Core

## Status

Accepted

## Context

The system needs a relational database with:

- Reliable transactional support
- Strong tooling in the .NET ecosystem
- Compatibility with integration testing via containers
- Hosted options for production (managed or serverless)

The backend is built in .NET, and existing course work and prior projects use

Entity Framework Core for data access.

At this point (D2+ and Vertical Slice 1), the permanent choice of database and

ORM needs to be locked in so the data model and migrations can be designed.

## Decision

We will:

- Use **PostgreSQL** as the primary database engine.
- Use **Entity Framework Core** as the ORM and migrations engine.
- Use a **code-first** approach where:
  - Entities and configurations are defined in C#.
  - EF Core generates migrations from the model.
  - Migrations are committed to source control and applied explicitly.

Integration tests will use **TestContainers** to run PostgreSQL in a container

locally and in CI, ensuring schema and behaviour match production as closely as

possible.

## Alternatives Considered

### SQLite

- Pros:
  - Simple to set up locally.
  - Fast in-memory mode for tests.
- Cons:
  - Weaker parity with PostgreSQL features.
  - Differences in type handling and query behaviour.
  - Less realistic testing for concurrency and transactions.

### SQL Server

- Pros:
  - Mature .NET tooling.
  - Full relational feature set.
- Cons:
  - Heavier operational footprint for a small project.
  - More complex local and CI setup.
  - Less alignment with typical containerised, cross-platform demos.

## Consequences

### Positive

- Strong alignment between development, testing, and deployment environments.
- Ability to use PostgreSQL features (indexes, constraints, transactions)

confidently.

- Reuse of EF Core practices from existing material and examples.
- Simple integration of TestContainers for realistic database integration tests.

### Negative

- Slightly higher setup complexity compared to SQLite.
- Need to manage a PostgreSQL instance for development (local instance or

container) and configure hosted instances for demo/production.

- Need to understand PostgreSQL-specific behaviour where it differs from other

engines.

## Risks and Mitigations

- **Risk**: Connection limits or cold starts in hosted Postgres.
  - **Mitigation**: Use connection pooling, sensible retry policies, and local

fallback for tests when necessary.

- **Risk**: TestContainers flakiness in CI.
  - **Mitigation**: Pin image versions, wait for health checks, and ensure CI

has sufficient resources.

## Follow-up Actions

### Evidence

- Repo path: `docs/adr/[[0005-use-postgresql-and-ef-core.md](http://0005-use-postgresql-and-ef-core.md)]`
- Integration tests: Testcontainers Postgres stands up in CI (see integration test job)

### Consequences for exam goals (2–3 lines)

- Realistic DB in tests increases credibility of D2/D3 evidence.
- Code‑first migrations + Postgres parity reduce demo risk.
- Clear rationale assessors can question and see validated in CI.
- Document schema snapshots in `docs/reference/[schema.md](http://schema.md)`.
- Document migrations in `docs/reference/[migrations.md](http://migrations.md)`.
- Add integration tests that:
  - Boot a TestContainers PostgreSQL instance.
  - Apply migrations on startup.
  - Exercise core data access paths (Player, Game, Board, Deposit).
