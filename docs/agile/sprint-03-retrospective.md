# Sprint 3 Retrospective — Auth & Security

**Sprint:** 3
**Date:** 2025-11-21
**Status:** Completed
**Tag:** v1.3.0

---

## What Went Well

### Technical Wins
- **JWT Authentication**: Successfully implemented complete auth flow with refresh tokens
- **Authorization Policies**: Clean separation of Admin vs Player roles using policy-based auth
- **DTO Validation**: All input validated with DataAnnotations
- **Test Coverage**: Increased to 56 tests (unit + integration) all passing
- **All Endpoints Protected**: No unprotected state-changing operations

### Process Wins
- **CI Stability**: Resolved TestContainers issues from Sprint 2
- **Security-First Approach**: Authentication implemented before any game logic
- **Exam Compliance**: CDS.Security requirements fully addressed

### Learning
- Better understanding of ASP.NET Core Identity and JWT configuration
- Policy-based authorization patterns for role separation

---

## What Could Be Improved

### Technical Debt
- [ ] Review token expiration times for production
- [ ] Consider refresh token rotation strategy
- [ ] Add rate limiting for auth endpoints

### Process
- [ ] Earlier integration testing of auth flows
- [ ] Document auth configuration for team reference

### Time Sinks
- Security review iterations required multiple fix commits
- NSwag configuration needed adjustment for new auth endpoints

---

## Action Items

### Immediate (Sprint 4)

| Action | Owner | Priority |
|--------|-------|----------|
| Implement React auth context integration | Team | Critical |
| Add protected route components | Team | Critical |
| Document JWT configuration | Team | High |
| Add rate limiting to auth endpoints | Team | Medium |

### Technical Improvements

| Improvement | Sprint |
|-------------|--------|
| React Router protected routes | 4 |
| Token refresh flow in client | 4 |
| Login/Register UI components | 4 |
| Admin dashboard views | 4 |

### Process Improvements

| Improvement | Reason |
|-------------|--------|
| Security checklist for each PR | Ensure consistent security reviews |
| Auth flow documentation | Onboarding and maintenance |
| Integration test patterns for auth | Reusable test fixtures |

---

## Lessons Learned

### 1. Policy-Based Auth is More Maintainable
Using named policies (RequireAdmin, RequirePlayer) instead of direct role checks provides:
- Better testability
- Cleaner controller code
- Easier to modify requirements

### 2. Test Early with Real Auth
Integration tests with actual JWT tokens caught issues that unit tests missed. The TestContainers setup paid off for auth testing.

### 3. Security Review Process Works
Multiple security review iterations improved code quality:
- Removed hardcoded secrets
- Fixed token validation settings
- Added proper CORS configuration

### 4. Sprint 2 Action Items Addressed
- DataAnnotations validation added (action item from Sprint 2)
- Integration test reliability improved
- CI is now stable and green

---

## Sprint Health

| Indicator | Status | Notes |
|-----------|--------|-------|
| Team Morale | Green | Auth complete, ready for UI work |
| Velocity | Green | All planned items delivered |
| Code Quality | Green | Security review passed |
| Documentation | Green | Auth patterns documented |
| Exam Alignment | Green | CDS.Security requirements met |

---

## Recommendations for Sprint 4

### Do More Of
- Security-first design decisions
- Integration tests for critical paths
- Early exam spec review

### Do Less Of
- Deferred security considerations
- Ad-hoc API changes without client regeneration

### Start Doing
- UI component testing
- E2E auth flow testing
- Performance benchmarking

### Stop Doing
- Pushing without running full test suite
- Skipping NSwag regeneration after API changes

---

## Open Questions

1. What token refresh strategy should the React client use?
2. Should admin and player have separate login pages?
3. How to handle session timeout UX in the client?
4. Fly.io secrets management for JWT keys?

---

## Next Sprint Focus

**Sprint 4: React UI + Deployment** is the final push for MVP:
- React pages with auth integration
- Game logic implementation
- Fly.io deployment
- End-to-end flows working

This sprint delivers the user-facing application and production deployment.

---

## Metrics

| Metric | Value |
|--------|-------|
| Tests Added | 26+ |
| Total Tests | 56 |
| Endpoints Protected | 100% |
| Security Review Iterations | 3 |
| CI Build Status | Green |
