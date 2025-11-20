# Sprint 1 Retrospective - Walking Skeleton

**Sprint:** 1
**Duration:** Walking Skeleton milestone
**Tag:** `v1.0.0-walking-skeleton`

## What Went Well

- **Vertical slice achieved:** Full communication from client to database operational
- **CI pipeline established:** GitHub Actions running build, test, lint on every PR
- **Testcontainers working:** Integration tests with real PostgreSQL in CI
- **NSwag client generation:** Type-safe API client prevents contract drift
- **Documentation structure:** Diátaxis model adopted early

## What Could Be Improved

- **Package version management:** Encountered OpenApi/Swashbuckle version conflicts
- **NSwag runtime mismatches:** Learned that URL-based generation is more reliable than assembly reflection
- **Local Docker limitations:** Shadow PC cannot run Docker, requiring CI-only testing strategy

## Action Items for Next Sprint

| Action | Owner | Status |
|--------|-------|--------|
| Add Husky for Git hooks | Team | Sprint 2 |
| Implement commitlint | Team | Sprint 2 |
| Add secretlint | Team | Sprint 2 |
| Document Shadow PC limitations | Team | Sprint 2 |
| Skip local integration tests | Team | Sprint 2 |

## Lessons Learned

1. **Pin package versions explicitly** to avoid transitive dependency conflicts
2. **Use URL-based NSwag generation** to avoid .NET runtime version mismatches
3. **Design for CI-first testing** when local Docker is unavailable
4. **Document decisions early** via ADRs to maintain clarity

## Metrics

| Metric | Value |
|--------|-------|
| Planned items | 8 |
| Completed items | 8 |
| Velocity | 100% |
| CI builds | All green |

## Team Sentiment

- Confidence in architecture: High
- Readiness for Sprint 2: High
- Technical debt: Minimal
