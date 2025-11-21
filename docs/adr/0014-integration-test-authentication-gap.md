# ADR 0014: Integration Test Authentication Gap

## Status

Accepted

## Date

2025-01-22

## Context

During Sprint 3, JWT authentication was added to the API (ADR-0011). However, the integration tests were not updated to authenticate with the API, causing all tests hitting protected endpoints to fail with 401 Unauthorized.

Additionally, the CI workflow in `.github/workflows/ci.yml` was configured with `|| true` on both `dotnet build` and `dotnet test` commands, causing the pipeline to report success even when tests failed. This allowed the authentication gap to go unnoticed throughout Sprint 3.

### Root Causes

1. **Missing test authentication**: `ApiFactory.CreateClient()` returned an unauthenticated HttpClient, but API endpoints require JWT tokens
2. **Silent CI failures**: CI workflow used `|| true` to suppress exit codes, masking test failures
3. **No test infrastructure for JWT**: No helper methods existed to generate valid test tokens

## Decision

### Fix 1: ApiFactory Authentication Support

Add test JWT configuration and authenticated client helper to `ApiFactory.cs`:

- Configure test JWT secret, issuer, and audience via `IConfiguration`
- Add `CreateAuthenticatedClient(role, userId)` method that generates valid JWT tokens
- Tests can request Admin or Player role tokens as needed

### Fix 2: Update All Integration Tests

Change all API test constructors from `factory.CreateClient()` to `factory.CreateAuthenticatedClient("Admin")`:

- `GamesApiTests.cs`
- `BoardsApiTests.cs`
- `PlayersApiTests.cs`
- `TransactionsApiTests.cs`

Health check tests can remain unauthenticated.

### Fix 3: Dual-Mode Database Configuration

Add environment-based database selection to `ApiFactory`:

- Check `USE_TESTCONTAINERS` environment variable in constructor
- **CI (USE_TESTCONTAINERS=true)**: Use PostgreSQL via Testcontainers for production parity
- **Local (no env var)**: Use SQLite in-memory for fast, Docker-free testing
- Container creation moved to `InitializeAsync()`, never in constructor
- SQLite connection kept open for test lifetime to preserve in-memory data

### Fix 4: CI Pipeline Strictness

Remove `|| true` from build and test commands in CI workflow:

```yaml
# Before (silent failures)
run: dotnet build ... || true
run: dotnet test ... || true

# After (fail fast)
run: dotnet build ...
run: dotnet test ...
```

## Consequences

### Positive

- Integration tests now properly authenticate and test real authorization flows
- CI pipeline fails fast on test failures, preventing silent regressions
- Test infrastructure supports role-based testing (Admin vs Player)
- Future tests have a clear pattern for authentication

### Negative

- Slight increase in test setup complexity
- Tests are coupled to JWT implementation details (acceptable for integration tests)

### Lessons Learned

1. **Never suppress CI failures**: Avoid `|| true` or `continue-on-error` without explicit justification
2. **Test auth early**: When adding authentication, immediately update test infrastructure
3. **Verify CI locally**: Run the same commands CI runs before pushing

## References

- ADR-0011: JWT Authentication
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Test infrastructure: `tests/DeadPigeons.IntegrationTests/ApiFactory.cs`
