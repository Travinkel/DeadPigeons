# Sprint 4 EPIC — Game Logic + React UI + Deployment

**Epic ID:** EPIC-04
**Sprint:** 4
**Branch:** `feature/game-ui-deploy`
**Status:** In Progress (React UI scaffold + theme preview started)

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

- [ ] Board purchase workflow complete with pricing
- [ ] Weekly game completion with winner detection
- [ ] React UI with all pages functional
- [ ] Deployed to Fly.io and accessible
- [ ] End-to-end tests passing
- [ ] Smoke tests in CI
- [ ] Exam presentation ready

---

## User Stories

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| US-4.1 | As a player, I need to purchase boards so I can play | Pricing enforced, balance checked, Saturday cutoff |
| US-4.2 | As a player, I need repeating boards so I don't re-enter numbers | Board repeats for X weeks, opt-out available |
| US-4.3 | As an admin, I need to complete games so winners are determined | 3 winning numbers, winners identified |
| US-4.4 | As a user, I need a React UI so I can use the system | All pages functional with React Router |
| US-4.5 | As a user, I need the app deployed so I can access it | Fly.io accessible publicly |
| US-4.6 | As an examiner, I need the project complete so I can evaluate | All features working, documented |

---

## Tasks

### TASK-4.1: Board Purchase Rules (8 SP)
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
- [ ] Pricing enforced correctly
- [ ] Cutoff rule implemented
- [ ] Insufficient balance rejected

---

### TASK-4.2: Repeating Boards (5 SP)
**Status:** Not started (blocked on TASK-4.1 pricing/cutoff wiring)

**Requirements:**
- Player specifies repeat count (X weeks)
- System auto-purchases in subsequent games
- Player can opt-out

**Acceptance Criteria:**
- [ ] Repeating boards created automatically
- [ ] Balance checked for repeats
- [ ] Opt-out functional

---

### TASK-4.3: Game Completion & Winners (5 SP)
**Status:** Not started

**Requirements:**
- Admin enters 3 winning numbers
- System identifies winning boards
- Calculate 70/30 prize split

**Acceptance Criteria:**
- [ ] Winners correctly identified
- [ ] Prize pool calculated
- [ ] Game status updated

---

### TASK-4.4: React UI Pages (13 SP)
**Status:** In Progress — Vite/DaisyUI shell with health/theme preview in `client/src/App.tsx`; Router/pages pending

**Pages:**
- Login page
- Dashboard (player/admin)
- Player management (admin)
- Transaction management (admin)
- Board purchase (player)
- Game history
- Profile/settings

**Requirements:**
- React Router for navigation
- TypeScript (no vanilla JS)
- NSwag client for API calls
- Responsive design

**Acceptance Criteria:**
- [ ] All pages functional
- [ ] React Router working
- [ ] API integration complete
- [ ] TypeScript throughout

---

### TASK-4.5: Fly.io Deployment (8 SP)
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

### TASK-4.6: End-to-End Tests (5 SP)
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

### TASK-4.7: Smoke Tests in CI (3 SP)
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

### TASK-4.8: Exam Preparation (5 SP)
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

| Task | Points |
|------|--------|
| TASK-4.1: Board Purchase Rules | 8 |
| TASK-4.2: Repeating Boards | 5 |
| TASK-4.3: Game Completion | 5 |
| TASK-4.4: React UI Pages | 13 |
| TASK-4.5: Fly.io Deployment | 8 |
| TASK-4.6: E2E Tests | 5 |
| TASK-4.7: Smoke Tests | 3 |
| TASK-4.8: Exam Prep | 5 |
| **Total** | **52** |

---

## React UI Structure

```
client/src/
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Players.tsx (admin)
│   ├── Transactions.tsx (admin)
│   ├── Boards.tsx
│   ├── Games.tsx
│   └── Profile.tsx
├── components/
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   └── ...
├── api/
│   └── client.ts (NSwag generated)
└── context/
    └── AuthContext.tsx
```

---

## Deployment Architecture

```
┌─────────────┐     ┌─────────────┐
│  Fly.io     │     │  Fly.io     │
│  (Client)   │────▶│  (API)      │
│  Static     │     │  Docker     │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Fly.io     │
                    │  PostgreSQL │
                    └─────────────┘
```

---

## Definition of Done

- [ ] Board purchase with pricing complete
- [ ] Repeating boards functional
- [ ] Game completion working
- [ ] All React pages functional
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
| Deployment issues | Medium | High | Test locally with Docker first |
| UI complexity | Medium | Medium | Use component library (DaisyUI) |
| Time pressure | High | High | Prioritize core features |

---

## Related Documentation

- [Roadmap](roadmap.md)
- [MVP Definition](MVP-Definition.md)
- [Sprint 3 Epic](sprint-03-epic.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
