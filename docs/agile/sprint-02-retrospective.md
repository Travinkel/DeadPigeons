# Sprint 2 Retrospective — Data Model + Basic Endpoints

**Sprint:** 2
**Date:** 2025-11-20
**Status:** In Progress

---

## What Went Well

### Technical Wins
- **Entity Design**: Clean separation of concerns with proper exam compliance
- **Test Coverage**: 30 unit tests covering all service methods
- **Documentation**: Successfully restructured agile docs to sprint-based approach
- **Migration**: EF Core migration generated cleanly with all relationships

### Process Wins
- **Exam Alignment**: Identified and fixed critical exam requirements early
  - IsActive=false default
  - Phone required
  - Board pricing documented
- **Security Awareness**: Added warning for unprotected endpoints

### Learning
- Better understanding of TestContainers configuration in CI
- GitHub Actions test reporting options explored

---

## What Didn't Go Well

### CI/CD Challenges
- **TestContainers Issues**: Ryuk (ResourceReaper) failing in GitHub Actions
- **Test Reporting**: Multiple iterations to get HTML reports working
- **Workflow Triggers**: Invalid YAML caused workflows not to run

### Time Sinks
- CI debugging took significant time
- Multiple commits to fix workflow issues

### Technical Debt
- InMemory database limitations for unit tests (query filters not applied)
- Null reference warning in PlayerService needs fixing

---

## Action Items

### Immediate (Before Sprint 3)

| Action | Owner | Priority |
|--------|-------|----------|
| Get CI green | Team | Critical |
| Merge PR #3 | Team | Critical |
| Tag v1.2.0-data-model | Team | High |
| Fix PlayerService null warning | Team | Medium |

### Process Improvements

| Improvement | Reason |
|-------------|--------|
| Test CI changes locally first | Avoid multiple fix commits |
| Use act or similar for local workflow testing | Faster feedback loop |
| Document TestContainers setup for CI | Future reference |

### Technical Improvements

| Improvement | Sprint |
|-------------|--------|
| Add DataAnnotations validation to DTOs | 3 |
| Migrate to XUnit.DependencyInjection | 3 |
| Improve integration test reliability | 3 |

---

## Lessons Learned

### 1. CI Configuration is Critical Path
The workflow file issues blocked the entire sprint completion. Future sprints should:
- Validate workflow YAML locally
- Use simpler patterns initially
- Test CI changes in isolation

### 2. Exam Requirements Must Be First
Early identification of exam-specific requirements (IsActive=false, Phone required) prevented rework. Always:
- Review exam spec at sprint start
- Document requirements in epic
- Verify compliance in tests

### 3. Documentation Structure Matters
Consolidating to sprint-based epics improved clarity. The old structure (separate epics/tasks/userstories) was confusing and didn't map to exam deliverables.

### 4. TestContainers Needs CI-Specific Config
Default TestContainers setup doesn't work well in GitHub Actions. Need:
- Disable Ryuk (TESTCONTAINERS_RYUK_DISABLED=true)
- Use service containers for reliability
- Proper health checks

---

## Sprint Health

| Indicator | Status | Notes |
|-----------|--------|-------|
| Team Morale | 🟡 | CI issues frustrating but solvable |
| Velocity | 🟡 | 88% due to CI blockers |
| Code Quality | 🟢 | Clean architecture, good tests |
| Documentation | 🟢 | Restructured and updated |
| Exam Alignment | 🟢 | Key requirements identified |

---

## Recommendations for Sprint 3

### Do More Of
- Early exam spec review
- Unit tests for all service methods
- Security considerations upfront

### Do Less Of
- Complex CI configurations without testing
- Multiple small fix commits

### Start Doing
- Local CI testing with act
- Test coverage reports
- Security audit checklist

### Stop Doing
- Pushing CI changes without validation
- Assuming default configs work in CI

---

## Open Questions

1. Should we use service containers instead of TestContainers?
2. Is ReportGenerator the best option for test reporting?
3. How to handle flaky integration tests in CI?

---

## Next Sprint Focus

**Sprint 3: Auth & Security** is CRITICAL for CDS.Security exam:
- JWT authentication
- Password hashing
- Authorization policies
- Protected endpoints

This sprint gates all subsequent work and must be prioritized.
