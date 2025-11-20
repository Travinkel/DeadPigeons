# MVP Definition — Dead Pigeons

This document defines the Minimum Viable Product requirements aligned with the exam specification.

**Submission Deadline:** December 19, 2025
**Oral Exams:** January 5-16, 2026
**Last Updated:** 2025-11-20

---

## 1. Functional Requirements

### EPIC 1: Player & Balance Management

- **Admin - Player Registration:** Register players with required fields:
  - Full name (required)
  - Email (required, unique)
  - Phone (required)
  - **Players are inactive by default** — Admin must activate

- **Admin - Player Management:** Full CRUD for players including activate/deactivate

- **Player - Balance Deposits:** Signal deposit by submitting MobilePay transaction ID

- **Admin - Transaction Approval:** View and approve pending transactions to update balance

- **Player - View Balance:** See current approved balance (calculated from transaction history)

### EPIC 2: Core Game Loop

- **Player - Purchase Boards:** Active player with positive balance can purchase boards:
  - 5 numbers = 20 DKK
  - 6 numbers = 40 DKK
  - 7 numbers = 80 DKK
  - 8 numbers = 160 DKK
  - **Cutoff:** Saturday 5 PM (no purchases after)

- **Player - Repeating Boards:** Option to repeat board for X subsequent weeks
  - Player can opt-out of repetition

- **Admin - Conclude Game:** End current game by inputting 3 winning numbers
  - Automatically activates next game

- **System - Prize Distribution:**
  - 70% to prize pool
  - 30% to facility management (Jerne IF)

- **Admin - View Game History:** See past games with boards played and winners

- **Admin - Tally Winners:** Count of winning boards per game

---

## 2. Technical Requirements (Exam Specification)

### Systems Development (SDE2)

- [x] **CI/CD:** GitHub Actions workflow for build, test, lint
- [ ] **Testing:**
  - [ ] All service methods tested (happy + unhappy paths)
  - [ ] Use `XUnit.DependencyInjection` (exam requirement)
  - [x] Use `TestContainers` for database isolation

### Programming (PROG)

- [x] **Architecture:** Distributed app with React client + .NET API
- [ ] **Client:**
  - [ ] React + TypeScript (no vanilla JS in src/)
  - [ ] React Router for navigation
- [ ] **Server:**
  - [x] Entity Framework Core for database
  - [ ] Server-side validation (DataAnnotations)
  - [x] OpenAPI/Swagger via NSwag
  - [x] **GUIDs for all primary keys** (exam requirement)

### CDS Security

- [ ] **Deployment:** Cloud deployment (Fly.io) accessible publicly
- [ ] **Authentication:**
  - [ ] JWT-based login
  - [ ] Secure password hashing (PBKDF2/Identity Core)
- [ ] **Authorization:**
  - [ ] Roles: Admin, Player
  - [ ] Policy-based access control
- [x] **Secrets:** No secrets in git (environment variables only)
- [ ] **Documentation:**
  - [ ] README with security policies
  - [ ] Authorization matrix (who can access what)

---

## 3. Data Model Requirements

### Player Entity
| Field | Type | Constraint |
|-------|------|------------|
| Id | Guid | PK |
| Name | string | Required, max 100 |
| Email | string | Required, unique |
| Phone | string | **Required**, max 20 |
| IsActive | bool | **Default: false** |
| CreatedAt | DateTime | Required |
| UpdatedAt | DateTime | Required |
| DeletedAt | DateTime? | Soft delete |

### Business Rules
- Balance calculated from approved transactions (no balance column)
- Board numbers stored as PostgreSQL arrays
- Single active game at any time
- Winning board = contains all 3 winning numbers

---

## 4. Sprint Alignment

| Sprint | Focus | Exam Competencies |
|--------|-------|-------------------|
| Sprint 1 | Walking Skeleton + DevOps | SDE2: CI/CD, Git, Testing infra |
| Sprint 2 | Data Model + Endpoints | PROG: EF Core, GUIDs, Validation |
| Sprint 3 | Auth + Authz | CDS.Security: JWT, Hashing, Policies |
| Sprint 4 | Game Logic + UI + Deploy | PROG: React, CDS.Net: Cloud |

---

## 5. Current Status

### Overall Completion: 35%

| Area | Progress | Status |
|------|----------|--------|
| Systems Development | 60% | 🟡 On Track |
| Programming | 70% | 🟡 On Track |
| CDS Security | 10% | 🔴 At Risk |
| Functional Requirements | 30% | 🟡 On Track |

**Days to Deadline:** 29 (December 19, 2025)

---

### 5.1 Completed Items

**Sprint 1 - Walking Skeleton + DevOps:**
- [x] CI/CD pipeline (GitHub Actions with build, test, lint)
- [x] DevOps hardening (Husky, commitlint, secretlint, lint-staged)
- [x] Integration test infrastructure (TestContainers with PostgreSQL)
- [x] NSwag TypeScript client generation
- [x] GitHub Flow branching strategy

**Sprint 2 - Data Model + Endpoints:**
- [x] EF Core DbContext and entity configurations
- [x] All entities (Player, Transaction, Board, Game)
- [x] GUIDs for all primary keys
- [x] Soft-delete pattern (Player.DeletedAt with query filter)
- [x] Balance calculation from transaction history (no balance column)
- [x] Service layer (PlayerService, GameService, BoardService, TransactionService)
- [x] Controllers with CRUD endpoints
- [x] Unit tests (PlayerService)
- [x] Integration tests scaffolded
- [x] EF Core migration generated

### 5.2 In Progress

- [ ] Complete happy/unhappy path test coverage
- [ ] Server-side validation (DataAnnotations)
- [ ] React UI components and routing

### 5.3 Blocked / Not Started

| Item | Blocker | Priority |
|------|---------|----------|
| JWT Authentication | None - Ready to start | 🔴 Critical |
| Authorization Policies | Requires Auth | 🔴 Critical |
| Cloud Deployment | Requires Auth | 🔴 Critical |
| XUnit.DependencyInjection | None - Ready to start | 🟡 High |
| README Security Docs | Requires Auth Matrix | 🟡 High |

---

### 5.4 Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Auth not started | Critical | High | Start immediately - blocks 60% of remaining work |
| React UI minimal | High | Medium | Focus on core admin flows only |
| No cloud deployment | High | Medium | Use Fly.io templates for quick deploy |
| Missing XUnit.DI | Medium | Low | Quick migration of existing tests |

---

### 5.5 Critical Path to Exam

**Week 1 (Nov 20-26):** Security Foundation
- Implement JWT authentication with password hashing
- Add authorization policies (Admin, Player)
- Apply `[Authorize]` attributes to controllers

**Week 2 (Nov 27 - Dec 3):** Technical Debt
- Migrate tests to XUnit.DependencyInjection
- Add server-side validation (DataAnnotations)
- Complete happy/unhappy path test coverage

**Week 3 (Dec 4-10):** UI & Deployment
- Implement React UI (Admin dashboard, Player dashboard)
- Deploy to Fly.io
- Configure production environment variables

**Week 4 (Dec 11-17):** Documentation & Polish
- Complete README authorization matrix
- Document environment/configuration
- Final testing and bug fixes
- Submission preparation

---

### 5.6 Velocity & Burndown

| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 1 (Walking Skeleton + DevOps) | 8 | 8 | 100% |
| Sprint 2 (Data Model + Endpoints) - Current | 12 | 11 | 92% |
| Sprint 3 (Auth & Security) | 47 | 0 | - |
| Sprint 4 (Game Logic + UI + Deploy) | 52 | 0 | - |

**Estimated Remaining Effort:** ~100 story points across 4 weeks

---

## Definition of Ready

The MVP is **ready** when:
- [ ] All checkboxes in this document are ticked
- [ ] Tests pass (unit + integration)
- [ ] Deployed to cloud
- [ ] README documents security policies
- [ ] Authorization matrix complete
- [ ] All service methods have happy/unhappy path tests

---

## Related Documentation

- [Roadmap](roadmap.md)
- [Data Model Reference](../reference/data-model.md)
- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
