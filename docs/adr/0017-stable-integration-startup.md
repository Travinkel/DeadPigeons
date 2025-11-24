# ADR-0011: Stable Integration Test Startup

## Status
Accepted

## Context
Integration tests rely on TestContainers (PostgreSQL). The prior setup registered the DbContext before the container connection string was available, causing runtime failures (e.g., /health returning 500) when the Npgsql connection string was null. TestServer also enforced HTTPS redirection, which is unnecessary for in-memory test hosting and caused redirect/500 issues.

## Decision
- Start the Postgres TestContainer synchronously during WebApplicationFactory.ConfigureWebHost so the connection string is available when the DbContext is registered.
- Disable HTTPS redirection for integration tests via an in-memory config flag (`HttpsRedirection:Enabled=false`).
- Keep migrations + seeding in InitializeAsync after the container starts.

## Consequences
- Integration tests can create the application host with a valid Npgsql connection string, avoiding null-connection 500s (health endpoint now returns 200).
- HTTPS redirects do not interfere with TestServer responses.
- Startup remains idempotent; container is started once and disposed after the test run.
