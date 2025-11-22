# Sprint 4 EPIC — Game Logic + React UI + Deployment

**Epic ID:** EPIC-04
**Sprint:** 4
**Branch:** `feature/game-ui-deploy`
**Status:** In Progress (Milestone 1 Complete, Milestone 2 Blocked)

---

## Epic Summary

Complete the Dead Pigeons application with full game logic, React UI, and cloud deployment. This sprint delivers the final product ready for exam submission.

---

## BLOCKING ISSUE

**Issue:** 401 Unauthorized errors on Dashboard API calls

**Impact:** High - Dashboard functionality is non-functional despite UI completion

**Symptoms:**
- `/api/Players/{id}` - 401 Unauthorized
- `/api/Boards/player/{id}` - 401 Unauthorized
- `/api/Players/{id}/balance` - 401 Unauthorized
- `/api/Transactions/player/{id}` - 401 Unauthorized

**Error Location:** `PlayerDashboard.tsx:43`
```
Dashboard fetch error: SwaggerException: An unexpected server error occurred.
```

**Root Cause Analysis:**
The JWT token is either:
1. Not being properly attached to API requests from the dashboard
2. Token is invalid or expired
3. Authorization header not being sent by the NSwag client wrapper

**Required Resolution:**
- Verify `apiClient.ts` correctly adds `Authorization: Bearer <token>` header
- Check token storage/retrieval in AuthContext
- Validate token expiration handling
- Test API calls with manual token injection

---

## Exam Competencies

| Course | Competencies |
|--------|-------------|
| PROG | React + TypeScript, React Router, business logic |
| CDS.Networking | Cloud deployment (Fly.io), Docker, Nginx |
| SDE2 | E2E testing, deployment pipeline |

---

## Acceptance Criteria

- [ ] Board purchase workflow complete with pricing
- [ ] Weekly game completion with winner detection
- [ ] React UI with all pages functional
- [x] Auth shell and dashboards implemented (UI complete, data fetch blocked)
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
**Status:** Complete (UI) / BLOCKED (Data Fetch)

**Deliverables:**
- Shows balance, boards, recent transactions
- Fetches from API with JWT token

**Acceptance Criteria:**
- [x] Dashboard UI complete
- [ ] Data fetch working (BLOCKED by 401 auth issue)

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

### Milestone 2: Lottery Mechanics (PENDING)

#### TASK-4.5: Boards List/Detail Pages (3 SP)
**Status:** Not started

**Requirements:**
- Player view of owned boards
- Show numbers, game week, autoplay status
- File: `client/src/features/boards/BoardsPage.tsx`

**Acceptance Criteria:**
- [ ] Boards list page
- [ ] Board detail view
- [ ] Numbers display

---

#### TASK-4.6: Games List/Detail Pages (3 SP)
**Status:** Not started

**Requirements:**
- Active game, historical games
- Show week/year, board count, status
- File: `client/src/features/games/GamesPage.tsx`

**Acceptance Criteria:**
- [ ] Games list page
- [ ] Game detail view
- [ ] Status display

---

#### TASK-4.7: Transactions Page (3 SP)
**Status:** Not started

**Requirements:**
- List all transactions
- Filter by status (pending/approved)
- File: `client/src/features/transactions/TransactionsPage.tsx`

**Acceptance Criteria:**
- [ ] Transactions list
- [ ] Status filtering
- [ ] Amount display

---

#### TASK-4.8: Board Purchase Flow (5 SP)
**Status:** Not started

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
- [ ] Number selection UI
- [ ] Pricing enforced correctly
- [ ] Cutoff rule implemented
- [ ] Insufficient balance rejected

---

#### TASK-4.9: Board Repeat Logic (3 SP)
**Status:** Not started

**Requirements:**
- "Play same numbers again" button
- Prefill from existing board
- Player specifies repeat count (X weeks)
- System auto-purchases in subsequent games
- Player can opt-out

**Acceptance Criteria:**
- [ ] Repeating boards created automatically
- [ ] Balance checked for repeats
- [ ] Opt-out functional

---

#### TASK-4.10: Admin Game Completion (5 SP)
**Status:** Not started

**Requirements:**
- Admin enters 3 winning numbers
- System identifies winning boards
- Calculate 70/30 prize split

**Acceptance Criteria:**
- [ ] Set winning numbers UI
- [ ] Winners correctly identified
- [ ] Prize pool calculated
- [ ] Game status updated

---

### Milestone 3: Deployment + Polish

#### TASK-4.11: Fly.io Deployment (8 SP)
**Status:** Not started

**Requirements:**
- Dockerized API + client
- PostgreSQL on Fly.io
- Environment variables configured
- HTTPS with Nginx

**Acceptance Criteria:**
- [ ] API accessible publicly
- [ ] Client accessible publicly
- [ ] Database connected
- [ ] HTTPS working

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
| TASK-4.3: Player Dashboard | 3 | Complete (UI) / Blocked (Data) |
| TASK-4.4: Admin Dashboard | 3 | Complete |
| TASK-4.5: Boards Pages | 3 | Not started |
| TASK-4.6: Games Pages | 3 | Not started |
| TASK-4.7: Transactions Page | 3 | Not started |
| TASK-4.8: Board Purchase Flow | 5 | Not started |
| TASK-4.9: Board Repeat Logic | 3 | Not started |
| TASK-4.10: Admin Game Completion | 5 | Not started |
| TASK-4.11: Fly.io Deployment | 8 | Not started |
| TASK-4.12: E2E Tests | 5 | Not started |
| TASK-4.13: Smoke Tests | 3 | Not started |
| TASK-4.14: Exam Prep | 5 | Not started |
| **Total** | **55** | 12 SP Complete |

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
| 401 Unauthorized on dashboard API calls | High | Open | JWT token not being attached to requests |
| Integration tests failing | Medium | Open | Dual provider conflict (see INTEGRATION_TEST_STATUS.md) |
| GameResponse.status serialization | Low | Open | API returns number, client expects string |

---

## Definition of Done

- [ ] Board purchase with pricing complete
- [ ] Repeating boards functional
- [ ] Game completion working
- [ ] All React pages functional
- [ ] Dashboard data fetch working (401 issue resolved)
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
| 401 Auth issue blocks progress | High | High | Debug JWT token flow, verify apiClient.ts |
| Deployment issues | Medium | High | Test locally with Docker first |
| UI complexity | Medium | Medium | Use component library (DaisyUI) |
| Time pressure | High | High | Prioritize core features |

---

## Related Documentation

- [Roadmap](roadmap.md)
- [MVP Definition](MVP-Definition.md)
- [Sprint 3 Epic](sprint-03-epic.md)
- [Sprint 4 UI Status](../internal/SPRINT4_UI_STATUS.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
