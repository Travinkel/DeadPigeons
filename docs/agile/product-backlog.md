# Product Backlog — Dead Pigeons

**Last Updated:** November 22, 2025
**Backlog Owner:** Agile Project Manager
**Prioritization Model:** Business Value + Exam Compliance + Dependencies

---

## Backlog Summary

| Total Stories | Estimated Points | Current Sprint | Product Status |
|---------------|------------------|-----------------|-----------------|
| 23 | 68 | Sprint 4 | 91% Complete |

---

## Active Sprint (Sprint 4)

### Sprint 4 Final Status (50 SP Delivered, 5 SP Remaining)

#### Completed Items

| Story ID | User Story | Points | Priority | Status |
|----------|-----------|--------|----------|--------|
| TASK-4.12 | As a QA engineer, I need E2E tests so end-to-end workflows are validated | 5 | CRITICAL | Complete |
| TASK-4.13 | As a DevOps engineer, I need smoke tests in CI so deployments are verified | 3 | CRITICAL | Complete |
| US-5.1 | As a new player, I want to register myself without admin intervention | 3 | HIGH | Complete |
| US-5.2 | As a Jerne IF administrator, I want the club logo displayed prominently | 2 | MEDIUM | Complete |

#### Remaining Work

| Story ID | User Story | Points | Priority | Status |
|----------|-----------|--------|----------|--------|
| TASK-4.14 | As an examiner, I need exam preparation complete so the project is submission-ready | 5 | CRITICAL | In Progress |

---

## Product Backlog (Future Work)

Backlog items ordered by business value, exam compliance requirements, and dependencies.

### UI/UX Enhancements (High Priority)

#### 1. Register Button / Player Self-Registration

**Story ID:** `US-5.1`
**Priority:** 🔴 High
**Estimated Points:** 3 SP

**User Story:**
> As a new player, I want to register myself without admin intervention, so I can quickly join the game platform.

**Acceptance Criteria:**
- [ ] Registration form displays on login page (or dedicated route `/register`)
- [ ] Form collects: full name, email, phone number, password
- [ ] Form validates all required fields client-side (react-hook-form)
- [ ] Server validates uniqueness of email via API
- [ ] Password meets security requirements (8+ chars, uppercase, number, special char)
- [ ] Successfully registered player is **inactive by default** (admin must activate per MVP spec)
- [ ] User redirected to login page with success message after registration
- [ ] Error messages display for duplicate email or validation failures

**Dependencies:**
- Requires new RegisterDto and RegisterController endpoint
- Requires server-side validation in AuthService
- Exam competency: **CDS.Security** (registration validation, password requirements)

**Exam Alignment:**
- **PROG:** Form validation with react-hook-form
- **CDS.Security:** Password policy enforcement, input sanitization

**Subtasks:**
1. Create RegisterDto and register endpoint (`POST /auth/register`)
2. Add password validation rules to AuthService
3. Create RegisterPage.tsx with form
4. Add success/error messaging
5. Test registration flow (unit + integration)

**Implementation Notes:**
- Players start inactive to maintain admin control over eligibility
- Consider email verification (optional for MVP)
- Password requirements: NIST guidelines minimum

---

#### 2. Jerne IF Logo & Branding

**Story ID:** `US-5.2`
**Priority:** 🟡 Medium
**Estimated Points:** 2 SP

**User Story:**
> As a Jerne IF administrator, I want the club logo displayed prominently, so the platform reflects club branding and identity.

**Acceptance Criteria:**
- [ ] Jerne IF logo added to layout header (top-left or center)
- [ ] Logo links to `/dashboard` (home button)
- [ ] Logo is responsive (proper sizing on mobile/tablet/desktop)
- [ ] Logo file optimized for web (SVG preferred, <50KB)
- [ ] Color scheme respects Tailwind/DaisyUI theme
- [ ] Logo appears on all authenticated pages (layout component)
- [ ] Accessibility: logo has alt text or aria-label
- [ ] Brand color palette integrated (if applicable)

**Dependencies:**
- None — can be completed independently
- Exam competency: **PROG** (CSS responsive design, asset optimization)

**Exam Alignment:**
- **PROG:** Responsive design with Tailwind CSS
- **PROG:** Component composition (Layout updates)

**Subtasks:**
1. Source or create Jerne IF logo (SVG)
2. Add Logo component to Layout
3. Apply responsive CSS sizing
4. Add accessibility labels
5. Update brand colors (if needed)

**Implementation Notes:**
- Coordinate with Jerne IF for official logo approval
- Store logo in `client/public/assets/logo.svg`
- Consider dark/light theme variants
- No code changes required if using existing asset only

---

#### 3. Loading Spinner CSS Fix

**Story ID:** `US-5.3`
**Priority:** 🔴 High
**Estimated Points:** 1 SP

**User Story:**
> As a user, I want the loading spinner to display at an appropriate size, so the page layout doesn't jump or break during data fetches.

**Acceptance Criteria:**
- [ ] Loading spinner component created or updated
- [ ] Spinner size is consistent (recommend: 3-4rem diameter)
- [ ] Spinner is centered on page (not top-left corner)
- [ ] Spinner container uses proper flexbox/grid centering
- [ ] Spinner animation is smooth and accessible (prefers-reduced-motion respected)
- [ ] Loading state doesn't cause layout shift (CSS height reserved)
- [ ] Visible during all API calls (data fetches)
- [ ] Spinner disappears immediately when data loads

**Dependencies:**
- None — CSS-only fix
- Exam competency: **PROG** (CSS, component lifecycle)

**Exam Alignment:**
- **PROG:** Tailwind CSS, responsive design
- **PROG:** React state management (isLoading flag)

**Subtasks:**
1. Identify all loading spinner instances in codebase
2. Create reusable LoadingSpinner component
3. Apply consistent sizing and centering CSS
4. Add animation and accessibility rules
5. Update all data-fetching pages to use component

**Implementation Notes:**
- Common issue: spinner too large due to incorrect sizing
- Recommend: `h-16 w-16` (Tailwind) or `64px` in rem
- Center with: `flex items-center justify-center min-h-screen`
- Test on mobile (verify no layout shift)
  git commit -m "fix: align openapi and xunit dependencies" 
git push
---

### Testing & Quality (Critical for Exam)

#### 4. End-to-End Testing Framework

**Story ID:** `US-5.4` (Extends TASK-4.12)
**Priority:** 🔴 CRITICAL
**Estimated Points:** 5 SP
**Status:** In Sprint 4

**User Story:**
> As a QA engineer, I need automated E2E tests covering critical user workflows, so the platform's end-to-end functionality is verified before deployment.

**Acceptance Criteria:**
- [ ] Playwright installed and configured
- [ ] E2E test directory: `tests/e2e/`
- [ ] 3-5 critical path tests cover:
  - [ ] User login flow (valid/invalid credentials)
  - [ ] Board purchase workflow (select numbers, pricing validation, balance check)
  - [ ] Game completion by admin (set winners, detect winners)
  - [ ] Transaction approval workflow (optional)
- [ ] Tests run against live Fly.io deployment
- [ ] All tests pass before merge to main
- [ ] CI/CD job runs E2E tests post-deployment
- [ ] Test coverage focuses on happy path + validation failures

**Dependencies:**
- Requires TASK-4.11 (Fly.io deployment live)
- Exam competency: **SDE2** (E2E testing, automation)

**Exam Alignment:**
- **SDE2:** Playwright automation, test strategy
- **SDE2:** CI/CD integration, quality gates
- **PROG:** Understanding of critical workflows

**Subtasks:**
1. Install and configure Playwright
2. Create auth test suite (login, register, logout)
3. Create board purchase test suite
4. Create game completion test suite
5. Add E2E job to GitHub Actions workflow
6. Document test execution and results

**Implementation Notes:**
- Start with critical path only (avoid over-testing)
- Use page objects pattern for maintainability
- Run tests in CI after deployment (gate for releases)
- Consider parallel test execution for speed

---

### Process & Documentation (Exam Required)

#### 5. E2E Test Documentation

**Story ID:** `US-5.5`
**Priority:** 🟡 High
**Estimated Points:** 2 SP

**User Story:**
> As an examiner, I need E2E test documentation, so I understand the testing strategy and test coverage.

**Acceptance Criteria:**
- [ ] Document created: `docs/testing/e2e-testing.md`
- [ ] Test framework choice justified (Playwright vs Cypress)
- [ ] Test scenarios documented with expected outcomes
- [ ] Test data setup process documented
- [ ] Instructions for running tests locally
- [ ] Instructions for running tests in CI
- [ ] Known limitations documented
- [ ] Test coverage matrix shows which features are tested

**Dependencies:**
- Requires TASK-4.12 (E2E tests implemented)
- Exam competency: **SDE2** (testing documentation)

**Exam Alignment:**
- **SDE2:** Testing strategy documentation
- **SDE2:** Process documentation

---

#### 6. Smoke Tests in CI Pipeline

**Story ID:** `US-5.6` (Extends TASK-4.13)
**Priority:** 🔴 CRITICAL
**Estimated Points:** 3 SP
**Status:** In Sprint 4

**User Story:**
> As a DevOps engineer, I need automated smoke tests in CI, so deployments are verified and failures are caught immediately.

**Acceptance Criteria:**
- [ ] Smoke test script created: `scripts/smoke-tests.sh` (or GitHub Actions job)
- [ ] Tests verify:
  - [ ] API health endpoint `/health` returns 200
  - [ ] Client loads successfully (GET `/` returns 200)
  - [ ] Database connectivity (query `/api/games` returns 200 with auth)
  - [ ] Authentication endpoint works (POST `/auth/login` with valid credentials)
- [ ] Tests run **after** deployment to Fly.io
- [ ] Tests run **before** marking release as stable
- [ ] Failure alerts on broken deployments
- [ ] Test execution time < 30 seconds
- [ ] Results reported in GitHub Actions

**Dependencies:**
- Requires TASK-4.11 (Fly.io deployment)
- Exam competency: **CDS.Networking** (deployment verification)

**Exam Alignment:**
- **CDS.Networking:** Deployment automation, health checks
- **SDE2:** CI/CD pipeline quality gates

**Subtasks:**
1. Create bash script or GitHub Actions job
2. Add health check endpoint verification
3. Add database connectivity check
4. Add authentication validation
5. Integrate into CI/CD pipeline
6. Test locally before merge

**Implementation Notes:**
- Keep smoke tests lean (< 1 minute execution)
- Use `curl` or simple HTTP requests
- Run after deployment, before marking release stable
- Log output for debugging deployment issues

---

### Backlog Items (Sprint 5+)

#### Future Enhancements

| Story ID | Feature | Points | Priority | Notes |
|----------|---------|--------|----------|-------|
| US-6.1 | Player profile management (edit name/email/phone) | 3 | Medium | Requires auth guards |
| US-6.2 | Email notifications for game results | 5 | Medium | Requires email service integration |
| US-6.3 | Admin reporting dashboard (stats, trends) | 5 | Low | Post-exam enhancement |
| US-6.4 | Mobile app variant (React Native) | 13 | Low | Out of scope for MVP |
| US-6.5 | Recurring deposit transactions | 3 | Medium | Nice-to-have for operations |
| US-6.6 | Board history and analytics | 5 | Low | Player engagement feature |

---

## Prioritization Framework

### Priority Levels Explained

#### 🔴 CRITICAL
- **Exam submission requirements** (must complete by Dec 19)
- **Blocking other features**
- **High business value**
- **Example:** E2E tests, deployment, registration

#### 🟡 HIGH
- **Exam competency gaps** (important for evaluation)
- **Improves user experience**
- **Reduces technical debt**
- **Example:** Loading spinner fix, branding, documentation

#### 🟢 MEDIUM
- **Nice-to-have features**
- **Low technical risk**
- **Post-MVP enhancements**
- **Example:** Profile management, reporting

#### ⚪ LOW
- **Future enhancements**
- **Out of current scope**
- **Post-exam work**
- **Example:** Mobile app, analytics

---

## INVEST Criteria Assessment

All stories in this backlog meet INVEST criteria:

### ✅ Independent
- Stories don't block each other (except where noted)
- Can be implemented in any order (with dependency awareness)
- Clear separation of concerns

### ✅ Negotiable
- Acceptance criteria can be adjusted in planning
- Story points can be refined after spike
- Scope is flexible

### ✅ Valuable
- All items deliver exam competency or user value
- Directly support MVP requirements
- Aligned with Jerne IF business goals

### ✅ Estimable
- Team can estimate story points confidently
- Based on similar past work
- Point ranges: 1-8 SP (no larger)

### ✅ Small
- All stories completable in single sprint
- Deliverable in 3-5 days of focused work
- Clear definition of completion

### ✅ Testable
- Acceptance criteria are verifiable
- Can be tested manually or automated
- Clear pass/fail conditions

---

## Dependency Map

```
Current Sprint (Sprint 4):
─────────────────────────
TASK-4.12 (E2E Tests) ──────┐
                             └──> TASK-4.14 (Exam Prep)
TASK-4.13 (Smoke Tests) ────┘

Future Sprint (Sprint 5):
─────────────────────────
US-5.1 (Registration)  → Independent
US-5.2 (Logo)          → Independent
US-5.3 (Spinner Fix)   → Independent
US-5.4 (E2E Framework) → Depends on TASK-4.12
US-5.5 (E2E Docs)      → Depends on US-5.4
US-5.6 (Smoke Tests)   → Depends on TASK-4.13

US-6.x (Sprint 5+)     → Lower priority enhancements
```

---

## Release Planning

### Release v1.4.0 (Sprint 4 Final)
**Target Date:** December 19, 2025
**Story Points:** 13 (E2E + Smoke + Exam Prep)
**Deliverables:**
- E2E test suite covering critical paths
- Smoke tests in CI/CD pipeline
- Exam-ready documentation and demo

### Release v1.5.0 (Sprint 5, Post-Exam)
**Estimated:** January 20, 2026
**Story Points:** 16 (Backlog items US-5.1 through US-5.6)
**Deliverables:**
- Player self-registration
- Jerne IF branding
- UI/UX polish fixes
- Enhanced testing documentation

---

## Estimation Notes

### Story Points Rationale

| Size | Complexity | Effort | Examples |
|------|------------|--------|----------|
| 1 SP | Trivial | < 4 hours | CSS fix, small doc update |
| 2 SP | Simple | 4-8 hours | Logo addition, small component |
| 3 SP | Moderate | 1-2 days | Form + endpoint, page component |
| 5 SP | Complex | 3-4 days | E2E tests, deployment, auth flow |
| 8 SP | Very Complex | 5+ days | Major feature (like TASK-4.11) |

---

## Acceptance Criteria Guidelines

All acceptance criteria follow this pattern:

1. **User-facing outcomes** (what user can see/do)
2. **Data/business rules** (pricing, validation, workflow)
3. **Technical implementation** (file locations, tech choices)
4. **Quality gates** (tests, linting, documentation)
5. **Accessibility** (a11y, mobile, keyboard navigation)

---

## Definition of Ready

A story is **ready** for sprint planning when:

- [ ] User story written in standard format
- [ ] Acceptance criteria are verifiable
- [ ] Dependencies identified
- [ ] Story points estimated (range: 1-8)
- [ ] Exam competencies mapped
- [ ] Technical approach discussed (spike if needed)
- [ ] Acceptance clearly communicates value

---

## Backlog Refinement Cadence

- **Weekly:** Prioritize top 10 items for readiness
- **Sprint Planning:** Confirm acceptance criteria, assign story points
- **Daily Standup:** Discuss blockers, update progress
- **Sprint Review:** Accept or reject completed stories
- **Retrospective:** Improve estimation and process

---

## Related Documentation

- [Sprint 4 Epic](sprint-04-epic.md) — Current sprint deliverables
- [MVP Definition](MVP-Definition.md) — Feature requirements
- [Roadmap](roadmap.md) — Release timeline
- [Product Definition](../explanation/product-definition.md) — Vision & goals

---

## Contact & Updates

**Last Updated:** November 22, 2025
**Next Review:** November 29, 2025 (post-Sprint 4 review)
**Backlog Owner:** Agile Project Manager

For questions about prioritization, estimation, or story details, consult the backlog owner during refinement sessions.
