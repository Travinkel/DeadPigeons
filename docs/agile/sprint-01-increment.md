# Sprint 1 Increment - Walking Skeleton

**Version:** 1.0.0-walking-skeleton
**Release Date:** Sprint 1 End
**Increment Type:** Foundation / Infrastructure

## Potentially Shippable Increment

This increment establishes the foundational architecture for the Dead Pigeons platform. While not user-facing functionality, it represents a complete vertical slice proving all system layers work together.

## Delivered Components

### Backend (ASP.NET Core Web API)

```
server/
├── DeadPigeons.Api/           # HTTP pipeline, controllers, middleware
│   ├── Program.cs             # Application entry point
│   └── Controllers/           # API endpoints
└── DeadPigeons.DataAccess/    # EF Core DbContext, entities
    ├── AppDbContext.cs        # Database context
    └── Migrations/            # EF Core migrations
```

**Endpoints:**
- `GET /health` - Returns 200 OK when API is operational

### Frontend (React + TypeScript)

```
client/
├── src/
│   ├── api/generated/         # NSwag-generated TypeScript client
│   └── App.tsx                # Root component
├── vite.config.ts             # Build configuration
└── tsconfig.json              # TypeScript configuration
```

### Test Infrastructure

```
tests/
├── DeadPigeons.Tests/              # Unit tests (xUnit)
└── DeadPigeons.IntegrationTests/   # Integration tests (Testcontainers)
    └── ApiFactory.cs               # WebApplicationFactory with PostgreSQL
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
- Backend: restore → build → test
- Frontend: install → lint → build
- NSwag: Generate and verify API client
```

## Quality Metrics

| Metric | Result |
|--------|--------|
| Unit Tests | 1 passing |
| Integration Tests | 1 passing |
| Build Status | Green |
| Lint Status | Green |
| Code Coverage | Baseline established |

## Technical Debt

- Minimal technical debt - clean foundation
- Package versions aligned (.NET 9, Swashbuckle 6.6.2)
- NSwag configured for URL-based client generation

## Dependencies

### Backend
- .NET 9.0
- Entity Framework Core 9.0.1
- Swashbuckle.AspNetCore 6.6.2
- Npgsql.EntityFrameworkCore.PostgreSQL

### Frontend
- React 18
- TypeScript 5
- Vite
- NSwag-generated client

### Testing
- xUnit 2.9.2
- Testcontainers 4.1.0
- FluentAssertions 8.0.0

## Deployment Readiness

- [x] Docker Compose for local PostgreSQL
- [x] CI validates all changes
- [ ] Production deployment (planned for later sprint)

## Increment Verification

```bash
# Verify the increment
git checkout v1.0.0-walking-skeleton
dotnet build DeadPigeons.sln
dotnet test DeadPigeons.sln
cd client && npm ci && npm run build
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Package version conflicts | Medium | High | Pin versions, use lock files |
| Docker availability in CI | Low | High | Use GitHub-hosted runners with Docker |
| Database connection issues | Medium | Medium | Testcontainers abstracts connection management |
| NSwag runtime mismatches | High | Medium | Use URL-based generation, not assembly reflection |

## Additional Risks Identified (SDE2 Curriculum)

- **Config Drift:** Differences between developer setups may cause nondeterministic builds.
  **Mitigation:** Add environment validation in Sprint 2.

- **API Contract Drift:** NSwag generation may become out of sync.
  **Mitigation:** CI step "API client drift detection" ensures contract stability.

- **Implicit Coupling Between Layers:** Early walking skeleton can hide poor boundaries.
  **Mitigation:** ADR-0002 documents architectural rules.

## Architecture Traceability

| Component | ADR Reference | Decision |
|-----------|---------------|----------|
| Project Structure | ADR-0001 | Layered architecture with Api, DataAccess separation |
| Database Choice | ADR-0002 | PostgreSQL with EF Core |
| Testing Strategy | ADR-0003 | Testcontainers for integration tests |
| CI/CD Pipeline | ADR-0004 | GitHub Actions with parallel jobs |

### Traceability to ADRs

- **ADR-0001 – Backend/Frontend Separation:** Walking Skeleton created the initial separation of concerns.
- **ADR-0002 – Database via EF Core + Migrations:** Verified through Testcontainers PostgreSQL tests.
- **ADR-0003 – NSwag Contract as Source of Truth:** Confirmed by automatic TypeScript client generation.
- **ADR-0004 – CI/CD GitHub Actions Baseline:** Walking Skeleton established mandatory build/test gates.

## Curriculum Alignment (SDE2)

This increment demonstrates competency in:
- **VCS Workflows:** Feature branching, PR-based merges
- **CI/CD:** Automated build, test, and validation pipeline
- **Code Generation:** Type-safe API client generation
- **Testing:** Integration testing with containerized dependencies

## Diátaxis Links

- **Tutorials:** docs/tutorials/local-setup.md
- **How-To:** docs/how-to/run-tests.md
- **Reference:** CLAUDE.md, API endpoints
- **Explanation:** docs/explanation/architecture.md

## Next Increment Preview

Sprint 2 will focus on DevOps hardening:
- Git hooks (Husky, lint-staged, commitlint)
- Enhanced CI quality gates
- Environment validation
- Branch protection
