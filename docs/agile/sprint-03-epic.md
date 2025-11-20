# Sprint 3 EPIC — Authentication + Authorization + Validation

**Epic ID:** EPIC-03
**Sprint:** 3
**Branch:** `feature/auth`
**Status:** Planned
**Priority:** CRITICAL for CDS.Security

---

## Epic Summary

Implement authentication, authorization, and validation to secure the Dead Pigeons API. This sprint is **mandatory** for passing CDS.Security and establishes the security foundation for all subsequent features.

## Why Auth Before Game Logic?

We implement authentication **before** full domain logic because:
1. **CDS.Security competencies are mandatory** for exam compliance
2. **Endpoints must be protected** before implementing game logic
3. The functional flows must reflect a **secure system design**

This ensures the entire project meets Programming, Systems Development, and Security requirements simultaneously.

---

## Exam Competencies

| Course | Competencies |
|--------|-------------|
| CDS.Security | JWT authentication, password hashing, authorization policies |
| CDS.Security | Role-based access control, secure development |
| PROG | Server-side validation (DataAnnotations) |
| SDE2 | XUnit.DependencyInjection, comprehensive testing |

---

## Acceptance Criteria

- [ ] JWT login/logout functional
- [ ] Password hashing (PBKDF2/Identity Core)
- [ ] Authorization policies (Admin/Player roles)
- [ ] All endpoints protected with `[Authorize]`
- [ ] DTO validation with DataAnnotations
- [ ] XUnit.DependencyInjection configured
- [ ] Happy + unhappy path tests for all service methods
- [ ] No secrets in git

---

## User Stories

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| US-3.1 | As a user, I need to log in so I can access my account | JWT token returned on valid credentials |
| US-3.2 | As an admin, I need to register players so they can use the system | Player created with hashed password |
| US-3.3 | As a player, I need my password secured so my account is safe | PBKDF2 hashing, no plaintext storage |
| US-3.4 | As the system, I need authorization so only allowed users access resources | Admin-only endpoints blocked for players |
| US-3.5 | As a developer, I need validation so invalid data is rejected | 400 Bad Request for invalid input |
| US-3.6 | As a developer, I need comprehensive tests so all paths are covered | XUnit.DependencyInjection, happy+unhappy |

---

## Tasks

### TASK-3.1: User Identity Model (5 SP)

**Description:** Add authentication fields to Player or create separate User entity.

**Requirements:**
- PasswordHash (string)
- Role (Admin/Player enum)
- RefreshToken (optional)
- LastLoginAt (optional)

**Acceptance Criteria:**
- [ ] Identity fields added
- [ ] Migration created
- [ ] No plaintext passwords

---

### TASK-3.2: JWT Authentication (8 SP)

**Description:** Implement JWT token generation and validation.

**Endpoints:**
- POST /api/auth/login
- POST /api/auth/refresh (optional)

**Requirements:**
- Token includes user ID and role claims
- Configurable expiration
- Secure secret management (env vars)

**Acceptance Criteria:**
- [ ] Login returns JWT token
- [ ] Token contains correct claims
- [ ] Invalid credentials return 401

---

### TASK-3.3: Password Hashing (5 SP)

**Description:** Implement secure password hashing.

**Requirements:**
- Use ASP.NET Core Identity PasswordHasher or
- PBKDF2 with proper iterations
- Salt per password

**Acceptance Criteria:**
- [ ] Passwords hashed on registration
- [ ] Verification works for login
- [ ] No plaintext in database

---

### TASK-3.4: Authorization Policies (8 SP)

**Description:** Implement role-based authorization.

**Policies:**
- RequireAdmin - Admin role required
- RequirePlayer - Player role required
- RequireAuthenticated - Any authenticated user

**Endpoints to Protect:**
| Policy | Endpoints |
|--------|-----------|
| Admin | POST /api/players, DELETE /api/players, POST /api/transactions/approve, POST /api/games, POST /api/games/{id}/complete |
| Player | POST /api/boards, GET own resources |
| Any Auth | GET /api/games, GET /api/players/{id}/balance |

**Acceptance Criteria:**
- [ ] Policies configured in Program.cs
- [ ] `[Authorize]` on all endpoints
- [ ] 403 for insufficient permissions
- [ ] 401 for unauthenticated

---

### TASK-3.5: DTO Validation (5 SP)

**Description:** Add DataAnnotations validation to all DTOs.

**Validations:**
- Required fields
- StringLength constraints
- Range constraints (numbers 1-90)
- EmailAddress format
- Custom validation attributes

**Acceptance Criteria:**
- [ ] All DTOs have validation attributes
- [ ] Invalid requests return 400
- [ ] Error messages are clear

---

### TASK-3.6: XUnit.DependencyInjection (5 SP)

**Description:** Migrate tests to use XUnit.DependencyInjection.

**Requirements:**
- Configure DI in tests
- Inject services properly
- Align with exam requirements

**Acceptance Criteria:**
- [ ] Tests use DI
- [ ] Services injected correctly
- [ ] Tests still pass

---

### TASK-3.7: Comprehensive Test Coverage (8 SP)

**Description:** Add tests for all service methods with happy + unhappy paths.

**Test Categories:**
- Authentication (login success/failure)
- Authorization (allowed/forbidden)
- Validation (valid/invalid input)
- Business rules (balance checks, game states)

**Acceptance Criteria:**
- [ ] All service methods tested
- [ ] Happy paths covered
- [ ] Unhappy paths covered (exceptions, errors)
- [ ] Edge cases tested

---

### TASK-3.8: Security Documentation (3 SP)

**Description:** Document security policies and authorization matrix.

**Deliverables:**
- Authorization matrix in README
- Security policy documentation
- Environment variable documentation

**Acceptance Criteria:**
- [ ] README has auth matrix
- [ ] Policies documented
- [ ] No secrets in git verified

---

## Story Point Summary

| Task | Points |
|------|--------|
| TASK-3.1: Identity Model | 5 |
| TASK-3.2: JWT Authentication | 8 |
| TASK-3.3: Password Hashing | 5 |
| TASK-3.4: Authorization Policies | 8 |
| TASK-3.5: DTO Validation | 5 |
| TASK-3.6: XUnit.DependencyInjection | 5 |
| TASK-3.7: Test Coverage | 8 |
| TASK-3.8: Security Documentation | 3 |
| **Total** | **47** |

---

## Authorization Matrix

| Endpoint | Anonymous | Player | Admin |
|----------|-----------|--------|-------|
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/auth/register | ❌ | ❌ | ✅ |
| GET /api/players | ❌ | ❌ | ✅ |
| GET /api/players/{id} | ❌ | Own | ✅ |
| PUT /api/players/{id} | ❌ | Own | ✅ |
| DELETE /api/players/{id} | ❌ | ❌ | ✅ |
| GET /api/players/{id}/balance | ❌ | Own | ✅ |
| POST /api/transactions/deposit | ❌ | ❌ | ✅ |
| POST /api/transactions/{id}/approve | ❌ | ❌ | ✅ |
| POST /api/boards | ❌ | ✅ | ✅ |
| GET /api/boards/{id} | ❌ | Own | ✅ |
| POST /api/games | ❌ | ❌ | ✅ |
| GET /api/games | ❌ | ✅ | ✅ |
| POST /api/games/{id}/complete | ❌ | ❌ | ✅ |

---

## Definition of Done

- [ ] JWT authentication working
- [ ] Passwords hashed securely
- [ ] All endpoints protected
- [ ] Authorization policies enforced
- [ ] DTOs validated
- [ ] Tests use XUnit.DependencyInjection
- [ ] All service methods tested (happy + unhappy)
- [ ] Security documented in README
- [ ] No secrets in git
- [ ] PR reviewed and merged

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Token security issues | Medium | High | Use proven libraries, test thoroughly |
| Authorization bypass | Low | Critical | Comprehensive tests, code review |
| Test migration breaks | Medium | Medium | Incremental migration, CI validation |

---

## Related Documentation

- [Roadmap](roadmap.md)
- [MVP Definition](MVP-Definition.md)
- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
