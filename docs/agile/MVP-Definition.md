# MVP Definition — Dead Pigeons

This document defines the Minimum Viable Product requirements aligned with the exam specification.

**Submission Deadline:** December 19, 2025
**Oral Exams:** January 5-16, 2026
**Last Updated:** 2025-11-21

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

### Overall Completion: 45%

| Area | Progress | Status |
|------|----------|--------|
| Systems Development | 65% | 🟡 On Track |
| Programming | 60% | 🔴 At Risk |
| CDS Security | 70% | 🟡 On Track |
| Functional Requirements | 45% | 🔴 At Risk |

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

**Sprint 3 - Auth + Security:**
- [x] JWT authentication and login endpoint
- [x] Password hashing (Identity password hasher)
- [x] Authorization policies (Admin/Player/Authenticated) in Program.cs
- [x] CORS + security headers middleware
- [x] DTO validation added
- [x] NSwag client aligned with secured API

### 5.2 In Progress

- [ ] React UI scaffold + routing (theme/health preview exists in App.tsx)
- [ ] Complete happy/unhappy path test coverage
- [ ] Server-side validation (DataAnnotations completeness)
- [ ] XUnit.DependencyInjection migration for remaining tests

### 5.3 Blocked / Not Started

| Item | Blocker | Priority |
|------|---------|----------|
| Board purchase rules + repeats | UI wiring + pricing logic | 🔴 Critical |
| Game completion + winner calc | Pending gameplay logic | 🔴 Critical |
| Fly.io deployment (API + client + Postgres) | Needs stable UI/auth flow | 🟡 High |
| E2E tests (UI/API) | Requires UI flows | 🟡 High |
| CI smoke tests | Requires deploy target | 🟡 High |
| README auth/security docs polish | Needs final routes/matrix | 🟡 High |

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

**Week 1 (Nov 21-27): UI + Pricing**
- Add React Router shell + pages (login, dashboards, boards, games, transactions)
- Implement board purchase rules (pricing, cutoff, balance) + repeat boards
- Wire NSwag client to UI flows

**Week 2 (Nov 28 - Dec 4): Game Completion + Tests**
- Admin game completion (3 numbers) + winner calc + prize split
- Finish DataAnnotations coverage
- XUnit.DependencyInjection migration + happy/unhappy tests for new logic

**Week 3 (Dec 5-11): Deployment & E2E**
- Fly.io deploy (API + client + Postgres, env vars, HTTPS)
- E2E test suite for critical paths; add CI smoke checks

**Week 4 (Dec 12-17): Documentation & Polish**
- README auth matrix + security/deploy docs
- Demo script, known issues, final bug fixes

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
