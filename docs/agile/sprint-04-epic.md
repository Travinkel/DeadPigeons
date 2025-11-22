# Sprint 4 EPIC — Game Logic + React UI + Deployment

**Epic ID:** EPIC-04
**Sprint:** 4
**Branch:** `feature/game-ui-deploy`
**Status:** In Progress (Milestone 1 & 2 Complete, Milestone 3 In Progress)

---

## Epic Summary

Complete the Dead Pigeons application with full game logic, React UI, and cloud deployment. This sprint delivers the final product ready for exam submission.

---

## Exam Competencies

| Course | Competencies |
|--------|-------------|
| PROG | React + TypeScript, React Router, business logic |
| CDS.Networking | Cloud deployment (Fly.io), Docker, Nginx |
| SDE2 | E2E testing, deployment pipeline |

---

## Acceptance Criteria

- [x] Board purchase workflow complete with pricing
- [x] Weekly game completion with winner detection
- [x] React UI with all pages functional
- [x] Auth shell and dashboards implemented
- [ ] Deployed to Fly.io and accessible
- [ ] End-to-end tests passing
- [ ] Smoke tests in CI
- [ ] Exam presentation ready

---

## User Stories

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| US-4.1 | As a user, I need a React UI so I can use the system | All pages functional with React Router |
| US-4.2 | As a player, I need to purchase boards so I can play | Pricing enforced, balance checked, Saturday cutoff |
| US-4.3 | As a player, I need repeating boards so I don't re-enter numbers | Board repeats for X weeks, opt-out available |
| US-4.4 | As an admin, I need to complete games so winners are determined | 3 winning numbers, winners identified |
| US-4.5 | As a user, I need the app deployed so I can access it | Fly.io accessible publicly |
| US-4.6 | As an examiner, I need the project complete so I can evaluate | All features working, documented |

---

## Tasks

### Milestone 1: Auth + Dashboards (COMPLETE)

#### TASK-4.1: React Router with Protected Routes (3 SP)
**Status:** Complete

**Deliverables:**
- AuthContext with JWT token management (localStorage)
- RequireAuth wrapper component
- Layout with navbar
- Route structure: `/login`, `/dashboard`, `/admin`, `/boards`, `/games`, `/transactions`

**Acceptance Criteria:**
- [x] React Router configured
- [x] Protected routes working
- [x] Layout with navigation

---

#### TASK-4.2: Login Page with Auth Integration (3 SP)
**Status:** Complete

**Deliverables:**
- Form with react-hook-form validation
- Calls `createApiClient().login()`
- Danish UI strings
- Error handling

**Acceptance Criteria:**
- [x] Login form functional
- [x] API integration complete
- [x] Error handling implemented

---

#### TASK-4.3: Player Dashboard (3 SP)
**Status:** Complete

**Deliverables:**
- Shows balance, boards, recent transactions
- Fetches from API with JWT token

**Acceptance Criteria:**
- [x] Dashboard UI complete
- [x] Data fetch working

---

#### TASK-4.4: Admin Dashboard (3 SP)
**Status:** Complete

**Deliverables:**
- Shows pending deposits, active game, players
- Stats grid with counts

**Acceptance Criteria:**
- [x] Dashboard UI complete
- [x] Stats display working

---

### Milestone 2: Lottery Mechanics (COMPLETE)

#### TASK-4.5: Boards List/Detail Pages (3 SP)
**Status:** Complete

**Requirements:**
- Player view of owned boards
- Show numbers, game week, autoplay status
- File: `client/src/features/boards/BoardsPage.tsx`

**Acceptance Criteria:**
- [x] Boards list page
- [x] Board detail view
- [x] Numbers display

---

#### TASK-4.6: Games List/Detail Pages (3 SP)
**Status:** Complete

**Requirements:**
- Active game, historical games
- Show week/year, board count, status
- File: `client/src/features/games/GamesPage.tsx`

**Acceptance Criteria:**
- [x] Games list page
- [x] Game detail view
- [x] Status display

---

#### TASK-4.7: Transactions Page (3 SP)
**Status:** Complete

**Requirements:**
- List all transactions
- Filter by status (pending/approved)
- File: `client/src/features/transactions/TransactionsPage.tsx`

**Acceptance Criteria:**
- [x] Transactions list
- [x] Status filtering
- [x] Amount display

---

#### TASK-4.8: Board Purchase Flow (5 SP)
**Status:** Complete

**Pricing Model:**
- 5 numbers = 20 DKK
- 6 numbers = 40 DKK
- 7 numbers = 80 DKK
- 8 numbers = 160 DKK

**Business Rules:**
- Saturday 5 PM cutoff
- Balance must cover cost
- Numbers 1-90, unique
- Auto-create purchase transaction

**Acceptance Criteria:**
- [x] Number selection UI
- [x] Pricing enforced correctly
- [x] Cutoff rule implemented
- [x] Insufficient balance rejected

---

#### TASK-4.9: Deposit Request Page (3 SP)
**Status:** Complete

**Requirements:**
- Player submits MobilePay transaction ID
- Creates pending deposit transaction
- Admin approval workflow

**Acceptance Criteria:**
- [x] Deposit request form
- [x] Transaction ID validation
- [x] Pending status display

---

#### TASK-4.10: Admin Game Completion (5 SP)
**Status:** Complete

**Requirements:**
- Admin enters 3 winning numbers
- System identifies winning boards
- Calculate 70/30 prize split

**Acceptance Criteria:**
- [x] Set winning numbers UI
- [x] Winners correctly identified
- [x] Prize pool calculated
- [x] Game status updated

---

### Milestone 3: Deployment + Polish

#### TASK-4.11: Fly.io Deployment (8 SP)
**Status:** In Progress

**Requirements:**
- Dockerized API + client
- PostgreSQL on Fly.io
- Environment variables configured
- HTTPS with Nginx

**Subtasks:**

| ID | Subtask | Status | SP |
|----|---------|--------|-----|
| 4.11.1 | Fly.io account and project setup | Not started | 1 |
| 4.11.2 | Configure fly.toml for API deployment | Not started | 1 |
| 4.11.3 | Deploy client as static site (nginx:alpine) | Not started | 1 |
| 4.11.4 | Provision PostgreSQL database on Fly.io | Not started | 1 |
| 4.11.5 | Configure environment variables and secrets | Not started | 1 |
| 4.11.6 | Add CI/CD deployment job to pipeline | Not started | 2 |
| 4.11.7 | Verification and smoke tests | Not started | 1 |

**Subtask Details:**

**4.11.1 - Fly.io Account and Project Setup**
- Create Fly.io account
- Install flyctl CLI
- Create two apps: `dead-pigeons-api` and `dead-pigeons-client`
- Set region (likely `ams` for Europe)

**4.11.2 - Configure fly.toml for API**
- Create `server/DeadPigeons.Api/fly.toml`
- Configure internal port (8080)
- Set health check endpoint (`/health`)
- Configure auto-scaling (min 1, max 2 instances)

**4.11.3 - Deploy Client as Static Site**
- Create `client/fly.toml`
- Use existing `client/Dockerfile` (nginx:alpine)
- Configure nginx for SPA routing (fallback to index.html)
- Set API URL environment variable

**4.11.4 - Provision PostgreSQL Database**
- Create Fly.io Postgres cluster
- Attach to API app
- Note connection string for secrets

**4.11.5 - Configure Environment Variables and Secrets**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT__Key` - JWT signing key
- `JWT__Issuer` - Token issuer
- `JWT__Audience` - Token audience
- `CORS__AllowedOrigins` - Client domain

**4.11.6 - Add CI/CD Deployment Job**
- Add deployment stage to GitHub Actions
- Configure `FLY_API_TOKEN` secret
- Deploy on merge to main
- Run migrations before deployment

**4.11.7 - Verification and Smoke Tests**
- Verify API health endpoint
- Verify client loads
- Test authentication flow
- Confirm database connectivity

**Exam Competency Coverage:**
- **CDS.Networking**: Cloud deployment (Fly.io), Docker containerization, Nginx reverse proxy/TLS termination
- **SDE2**: CI/CD deployment pipeline, infrastructure as code

**Acceptance Criteria:**
- [ ] API accessible publicly at `dead-pigeons-api.fly.dev`
- [ ] Client accessible publicly at `dead-pigeons-client.fly.dev`
- [ ] Database connected and migrations applied
- [ ] HTTPS working (Fly.io automatic TLS)
- [ ] CI/CD deploys on merge to main

---

#### TASK-4.12: End-to-End Tests (5 SP)
**Status:** Not started

**Test Scenarios:**
- Full game workflow
- Board purchase flow
- User authentication flow

**Acceptance Criteria:**
- [ ] E2E tests pass
- [ ] Cover critical paths
- [ ] Run in CI

---

#### TASK-4.13: Smoke Tests in CI (3 SP)
**Status:** Not started

**Requirements:**
- Deployment smoke tests
- Health checks
- Basic functionality verification

**Acceptance Criteria:**
- [ ] CI runs smoke tests
- [ ] Deployment verified
- [ ] Alerts on failure

---

#### TASK-4.14: Exam Preparation (5 SP)
**Status:** Not started

**Deliverables:**
- Final documentation polish
- Presentation prep
- Demo script
- Known issues documented

**Acceptance Criteria:**
- [ ] Documentation complete
- [ ] Demo working
- [ ] Ready for oral exam

---

## Story Point Summary

| Task | Points | Status |
|------|--------|--------|
| TASK-4.1: React Router | 3 | Complete |
| TASK-4.2: Login Page | 3 | Complete |
| TASK-4.3: Player Dashboard | 3 | Complete |
| TASK-4.4: Admin Dashboard | 3 | Complete |
| TASK-4.5: Boards Pages | 3 | Complete |
| TASK-4.6: Games Pages | 3 | Complete |
| TASK-4.7: Transactions Page | 3 | Complete |
| TASK-4.8: Board Purchase Flow | 5 | Complete |
| TASK-4.9: Deposit Request Page | 3 | Complete |
| TASK-4.10: Admin Game Completion | 5 | Complete |
| TASK-4.11: Fly.io Deployment | 8 | In Progress |
| TASK-4.12: E2E Tests | 5 | Not started |
| TASK-4.13: Smoke Tests | 3 | Not started |
| TASK-4.14: Exam Prep | 5 | Not started |
| **Total** | **55** | **34 SP Complete (62%)** |

---

## React UI Structure

```
client/src/
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── useAuth.ts
│   │   └── LoginPage.tsx
│   ├── dashboard/
│   │   ├── PlayerDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── boards/
│   │   └── BoardsPage.tsx
│   ├── games/
│   │   └── GamesPage.tsx
│   └── transactions/
│       └── TransactionsPage.tsx
├── shared/
│   └── components/
│       ├── RequireAuth.tsx
│       └── Layout.tsx
├── routes/
│   └── router.tsx
├── api/
│   ├── client.ts (NSwag generated)
│   └── apiClient.ts (JWT wrapper)
└── App.tsx
```

---

## Deployment Architecture

```
+-------------+     +-------------+
|  Fly.io     |     |  Fly.io     |
|  (Client)   |---->|  (API)      |
|  Static     |     |  Docker     |
+-------------+     +------+------+
                           |
                    +------v------+
                    |  Fly.io     |
                    |  PostgreSQL |
                    +-------------+
```

---

## Known Issues

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| CI/CD silent test failures | Critical | Open | v1.3.0-v1.3.2 released with failing integration tests showing as "green" |
| Integration tests failing | Medium | Open | Dual provider conflict (see INTEGRATION_TEST_STATUS.md) |
| GameResponse.status serialization | Low | Open | API returns number, client expects string |

**Resolved Issues:**
- 401 Unauthorized on dashboard API calls - Fixed: JWT token now properly attached to requests

---

## Definition of Done

- [x] Board purchase with pricing complete
- [x] Deposit request flow functional
- [x] Game completion working
- [x] All React pages functional
- [x] Dashboard data fetch working (401 issue resolved)
- [ ] Deployed to Fly.io
- [ ] E2E tests passing
- [ ] Smoke tests in CI
- [ ] Documentation complete
- [ ] Demo ready
- [ ] PR reviewed and merged
- [ ] Tagged v1.4.0

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CI/CD false positives | High | Critical | Audit pipeline, verify test failures fail the build |
| Deployment issues | Medium | High | Test locally with Docker first |
| Time pressure | Medium | High | Focus on Milestone 3 tasks only |

---

## Related Documentation

- [Roadmap](roadmap.md)
- [MVP Definition](MVP-Definition.md)
- [Sprint 3 Epic](sprint-03-epic.md)
- [Sprint 4 UI Status](../internal/SPRINT4_UI_STATUS.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
