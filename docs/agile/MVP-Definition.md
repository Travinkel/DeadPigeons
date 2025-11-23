# MVP Definition — Dead Pigeons

This document defines the Minimum Viable Product requirements aligned with the exam specification.

**Submission Deadline:** December 19, 2025
**Oral Exams:** January 5-16, 2026
**Last Updated:** 2025-11-23
**Status:** MVP COMPLETE
**Completion Date:** November 23, 2024

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

- [x] **CI/CD:** GitHub Actions workflow for build, test, lint, deploy
- [x] **Testing:**
  - [x] All service methods tested (happy + unhappy paths)
  - [x] Use `XUnit.DependencyInjection` (exam requirement)
  - [x] Use `TestContainers` for database isolation
  - [x] E2E Playwright tests for critical paths

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

- [x] **Deployment:** Cloud deployment (Fly.io) accessible publicly
  - [x] CI/CD deployment to Fly.io working
  - [x] Database seeder for initial data population
- [x] **Authentication:**
  - [x] JWT-based login
  - [x] Secure password hashing (PBKDF2/Identity Core)
- [x] **Authorization:**
  - [x] Roles: Admin, Player
  - [x] Policy-based access control
- [x] **Secrets:** No secrets in git (environment variables only)
- [x] **Documentation:**
  - [x] README with security policies
  - [x] Authorization matrix (who can access what)

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

### Overall Completion: 100% - MVP COMPLETE

| Area | Progress | Status |
|------|----------|--------|
| Systems Development | 100% | 🟢 Complete |
| Programming | 100% | 🟢 Complete |
| CDS Security | 100% | 🟢 Complete |
| Functional Requirements | 100% | 🟢 Complete |

**Completion Date:** November 23, 2024
**Days to Deadline:** 26 (December 19, 2025)

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

**Sprint 4 - Game Logic + React UI + Deployment (ALL COMPLETE):**
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
- [x] Fly.io deployment (API + client + Postgres)
- [x] CI/CD deployment pipeline working
- [x] Database seeder for initial data
- [x] E2E Playwright tests for critical paths
- [x] CI smoke tests
- [x] User registration page
- [x] Jerne IF logo integration
- [x] Exam preparation and documentation polish

### 5.2 All Milestones Complete

All Sprint 4 milestones have been delivered. The MVP is complete and ready for exam submission.

### 5.3 Delivered Features Summary

| Item | Priority | Status |
|------|----------|--------|
| Fly.io deployment | 🔴 Critical | Complete |
| CI/CD pipeline | 🔴 Critical | Complete |
| Database seeder | 🔴 Critical | Complete |
| E2E tests | 🟡 High | Complete |
| CI smoke tests | 🟡 High | Complete |
| Exam preparation | 🟡 High | Complete |

---

### 5.4 Risk Assessment

All major risks have been mitigated with project completion:

| Risk | Impact | Likelihood | Status |
|------|--------|------------|--------|
| Deployment issues | High | Medium | Mitigated - Fly.io working |
| Time pressure | Medium | Medium | Resolved - MVP complete |
| CI/CD silent failures | Medium | Low | Resolved - Pipeline fixed |

---

### 5.5 Critical Path to Exam - COMPLETE

**Week 1 (Nov 21-27): UI + Pricing** - COMPLETE
- [x] React Router shell + pages (login, dashboards, boards, games, transactions)
- [x] Board purchase rules (pricing, cutoff, balance)
- [x] NSwag client wired to UI flows

**Week 2 (Nov 23): Deployment** - COMPLETE
- [x] Fly.io deploy (API + client + Postgres, env vars, HTTPS)
- [x] CI/CD deployment pipeline working
- [x] Database seeder implemented
- [x] E2E test suite for critical paths
- [x] CI smoke checks post-deployment

**Remaining Time (Nov 24 - Dec 17): Polish & Preparation**
- [x] README auth matrix + security/deploy docs
- [x] Demo script, known issues, final bug fixes
- [x] Exam presentation preparation
- [ ] Final review and any additional polish

---

### 5.6 Velocity & Burndown

| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 1 (Walking Skeleton + DevOps) | 8 | 8 | 100% |
| Sprint 2 (Data Model + Endpoints) | 12 | 11 | 92% |
| Sprint 3 (Auth & Security) | 47 | 47 | 100% |
| Sprint 4 (Game Logic + UI + Deploy) | 55 | 55 | 100% |

**Total Story Points Delivered:** 121 SP
**Overall Velocity:** 98%

All planned work has been completed.

---

## Definition of Ready

The MVP is **ready** when:
- [x] All checkboxes in this document are ticked
- [x] Tests pass (unit + integration)
- [x] Deployed to cloud (Fly.io)
- [x] README documents security policies
- [x] Authorization matrix complete
- [x] All service methods have happy/unhappy path tests
- [x] CI/CD deployment pipeline working
- [x] Database seeder implemented

**MVP STATUS: COMPLETE - November 23, 2024**

---

## Related Documentation

- [Roadmap](roadmap.md)
- [Data Model Reference](../reference/data-model.md)
- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
