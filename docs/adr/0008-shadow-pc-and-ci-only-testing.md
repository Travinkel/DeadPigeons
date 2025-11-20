# ADR-0008: Shadow PC Environment and CI-Only Integration Testing

## Status
Accepted

## Date
2025-11-20

## Context

The development environment runs on a Shadow PC, which is a cloud-based virtual machine. Due to Shadow PC's architecture, Docker Desktop cannot be installed or run locally. This creates a constraint for:

1. **Integration tests:** Testcontainers requires Docker to spin up PostgreSQL containers
2. **Local database:** Docker Compose cannot run PostgreSQL locally
3. **Docker builds:** Cannot test container builds locally

The project uses Testcontainers for integration testing, which is a best practice for realistic database testing but requires Docker.

## Decision

We will adopt a **CI-first testing strategy** where:

### Local Development (Shadow PC)
- Run API and client development servers normally
- Run linting, formatting, and type checking locally
- Run pre-commit hooks (lint-staged, secretlint, commitlint)
- **Skip integration tests locally**

### CI Environment (GitHub Actions)
- Run full test suite including integration tests
- Testcontainers spins up PostgreSQL in CI
- Docker builds tested in CI
- All quality gates enforced

### Pre-push Hook Configuration
The pre-push hook runs only:
```bash
npm run typecheck --prefix client
npm run lint --prefix client
# Skip .NET tests - run in CI only
```

## Consequences

### Positive
- Development workflow remains productive on Shadow PC
- Full test coverage maintained via CI
- No compromise on integration test quality
- Clear separation between local and CI responsibilities

### Negative
- Cannot verify integration tests before pushing
- Must wait for CI to catch integration issues
- Slight delay in feedback loop for database-related changes

### Mitigations
- Strong CI pipeline catches all issues before merge
- Unit tests can run locally for quick feedback
- Type checking catches most errors before push

## Alternatives Considered

1. **Use remote Docker host:** Adds complexity, latency, and cost
2. **Mock database locally:** Loses realistic testing benefits
3. **Skip integration tests entirely:** Unacceptable quality trade-off

## Curriculum Alignment

- **SDE2:** CI/CD as primary quality gate
- **Programming II:** Separation of concerns (local vs CI responsibilities)
- **CDS.Security:** Secure testing without exposing credentials locally

## Related ADRs
- ADR-0001: Walking Skeleton and Project Structure
- ADR-0007: DevOps Hardening and Git Hooks
