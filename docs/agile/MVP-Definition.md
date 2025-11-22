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
- [x] **Client:**
  - [x] React + TypeScript (no vanilla JS in src/)
  - [x] React Router for navigation
- [x] **Server:**
  - [x] Entity Framework Core for database
  - [x] Server-side validation (DataAnnotations)
  - [x] OpenAPI/Swagger via NSwag
  - [x] **GUIDs for all primary keys** (exam requirement)

### CDS Security

- [ ] **Deployment:** Cloud deployment (Fly.io) accessible publicly
- [x] **Authentication:**
  - [x] JWT-based login
  - [x] Secure password hashing (PBKDF2/Identity Core)
- [x] **Authorization:**
  - [x] Roles: Admin, Player
  - [x] Policy-based access control
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

### Overall Completion: 75%

| Area | Progress | Status |
|------|----------|--------|
| Systems Development | 75% | 🟡 On Track |
| Programming | 90% | 🟢 Complete |
| CDS Security | 80% | 🟡 On Track |
| Functional Requirements | 85% | 🟢 On Track |

**Days to Deadline:** 27 (December 19, 2025)

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

**Sprint 4 - Game Logic + React UI (Milestones 1 & 2 Complete):**
- [x] React Router with protected routes
- [x] Login page with auth integration
- [x] Player dashboard with data fetch
- [x] Admin dashboard with stats
- [x] Boards list/detail pages
- [x] Games list/detail pages
- [x] Transactions page with filtering
- [x] Board purchase flow with pricing enforcement
- [x] Deposit request page
- [x] Admin game completion with winner detection

### 5.2 In Progress (Milestone 3 - Deployment)

- [ ] Fly.io deployment (API + client + Postgres)
- [ ] E2E tests for critical paths
- [ ] CI smoke tests
- [ ] Exam preparation and documentation polish

### 5.3 Not Started

| Item | Priority | Notes |
|------|----------|-------|
| Fly.io deployment | 🔴 Critical | 8 SP - Next priority |
| E2E tests | 🟡 High | 5 SP - After deployment |
| CI smoke tests | 🟡 High | 3 SP - After deployment |
| Exam preparation | 🟡 High | 5 SP - Final week |

---

### 5.4 Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Deployment issues | High | Medium | Test locally with Docker first, use Fly.io templates |
| Time pressure | Medium | Medium | 21 SP remaining with 27 days - manageable |
| CI/CD silent failures | Medium | Low | Audit pipeline during deployment phase |

---

### 5.5 Critical Path to Exam

**Week 1 (Nov 21-27): UI + Pricing** - COMPLETE
- [x] React Router shell + pages (login, dashboards, boards, games, transactions)
- [x] Board purchase rules (pricing, cutoff, balance)
- [x] NSwag client wired to UI flows

**Week 2 (Nov 28 - Dec 4): Deployment** - CURRENT
- [ ] Fly.io deploy (API + client + Postgres, env vars, HTTPS)
- [ ] Test deployment workflow locally with Docker

**Week 3 (Dec 5-11): Testing & CI**
- [ ] E2E test suite for critical paths
- [ ] CI smoke checks post-deployment

**Week 4 (Dec 12-17): Documentation & Polish**
- [ ] README auth matrix + security/deploy docs
- [ ] Demo script, known issues, final bug fixes
- [ ] Exam presentation preparation

---

### 5.6 Velocity & Burndown

| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 1 (Walking Skeleton + DevOps) | 8 | 8 | 100% |
| Sprint 2 (Data Model + Endpoints) | 12 | 11 | 92% |
| Sprint 3 (Auth & Security) | 47 | 47 | 100% |
| Sprint 4 (Game Logic + UI + Deploy) | 55 | 34 | 62% (in progress) |

**Remaining Effort:** 21 story points (Milestone 3 tasks)
- TASK-4.11: Fly.io Deployment (8 SP)
- TASK-4.12: E2E Tests (5 SP)
- TASK-4.13: Smoke Tests (3 SP)
- TASK-4.14: Exam Prep (5 SP)

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
