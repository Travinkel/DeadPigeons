# Sprint 3 Review — Authentication + Authorization + Validation

**Sprint Goal:** Implement authentication, authorization, and validation to secure the Dead Pigeons API.

**Sprint Duration:** Sprint 3
**Sprint Status:** Complete
**PR:** #5 (pending)
**Tag:** `v1.3.0` (pending)

---

## Sprint Backlog Items

| ID | Item | Status | Notes |
|----|------|--------|-------|
| TASK-3.1 | Identity Model | ✅ Done | Role enum, PasswordHash, LastLoginAt |
| TASK-3.2 | JWT Authentication | ✅ Done | Login/register endpoints, token generation |
| TASK-3.3 | Password Hashing | ✅ Done | ASP.NET Core Identity PasswordHasher |
| TASK-3.4 | Authorization Policies | ✅ Done | RequireAdmin, RequirePlayer, RequireAuthenticated |
| TASK-3.5 | DTO Validation | ✅ Done | DataAnnotations on all DTOs |
| TASK-3.6 | DI Patterns in Tests | ✅ Done | Using constructor injection pattern |
| TASK-3.7 | Test Coverage | ✅ Done | 9 auth tests added |
| TASK-3.8 | Security Documentation | ✅ Done | README auth matrix |
| TASK-3.9 | CORS + Security Headers | ✅ Done | Middleware configured |
| TASK-3.10 | Network Documentation | ✅ Done | networking.md created |

---

## Demonstration Summary

Sprint 3 delivers complete security infrastructure:

1. **JWT Authentication**
   - Login endpoint returns JWT token
   - Token includes user ID and role claims
   - Configurable expiration (default 60 min)
   - Secure secret management via environment variables

2. **Password Security**
   - ASP.NET Core Identity PasswordHasher (PBKDF2)
   - Salted hashes (different hash for same password)
   - No plaintext storage

3. **Authorization Policies**
   - RequireAdmin: Admin-only operations
   - RequirePlayer: Player or Admin
   - RequireAuthenticated: Any authenticated user
   - All endpoints protected with [Authorize]

4. **Input Validation**
   - DataAnnotations on all request DTOs
   - Email format validation
   - String length constraints
   - Range validation for amounts and numbers

5. **Network Security**
   - CORS policy for client origins
   - Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
   - Trust boundary documentation

---

## What Was Planned vs Delivered

| Planned | Delivered | Notes |
|---------|-----------|-------|
| 55 story points | 55 story points | All delivered |
| 10 tasks | 10 complete | All tasks done |
| JWT auth | JWT auth | ✅ |
| Authorization | Authorization | ✅ With policies |
| Validation | Validation | ✅ DataAnnotations |
| Test coverage | Test coverage | ✅ 9 auth tests |

---

## Definition of Done Verification

- [x] Code compiles without errors
- [x] Unit tests pass
- [x] JWT authentication working
- [x] All endpoints protected
- [x] DTOs validated
- [x] Documentation updated
- [ ] Code reviewed and merged to main
- [ ] Sprint increment tagged

---

## Curriculum Alignment

| Course | Competency | Evidence |
|--------|-----------|----------|
| CDS.Security | JWT authentication | AuthService, AuthController |
| CDS.Security | Password hashing | PasswordHasher (PBKDF2) |
| CDS.Security | Authorization policies | RequireAdmin, RequirePlayer |
| CDS.Networking | CORS | Program.cs CORS policy |
| CDS.Networking | Security headers | Middleware configuration |
| CDS.Networking | Network boundaries | networking.md |
| PROG | Server-side validation | DataAnnotations on DTOs |

---

## Metrics

| Metric | Value |
|--------|-------|
| Story Points Planned | 55 |
| Story Points Completed | 55 |
| Velocity | 100% |
| Unit Tests Added | 10 |
| Total Unit Tests | 40 |

---

## Action Items for Next Sprint

1. **Immediate:** Merge PR and tag v1.3.0
2. **Sprint 4:** Game logic, React UI, Fly.io deployment
   - Board purchase workflow
   - Winner detection algorithm
   - React pages with auth
   - Cloud deployment with HTTPS

---

## Code Review Fixes

Issues addressed after PR review:

| Issue | Resolution |
|-------|------------|
| Register returned token for inactive account | Now returns message, no token |
| Sync DB query in register | Changed to `AnyAsync()` |
| Missing ownership checks | Added to GetById, Update, GetBalance |
| JWT secret not validated | Added 32-char minimum check |
| Unused RefreshToken field | Removed from Player entity |
| Email case sensitivity | Normalized to lowercase |

---

## Stakeholder Feedback

*To be collected after demo*
