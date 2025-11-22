# Project Roadmap

## Exam Timeline

| Date | Event |
|------|-------|
| November 13, 2024 | Project Announcement |
| November 26-27, 2024 | Review Meetings |
| December 19, 2024 | Submission Deadline |
| January 5-16, 2025 | Oral Exams |

---

## Sprint Overview

| Sprint | Focus | Status | Tag |
|--------|-------|--------|-----|
| Sprint 1 | Walking Skeleton + DevOps | Done | v1.0.0, v1.1.0 |
| Sprint 2 | Data Model + Basic Endpoints | Done | v1.2.0 |
| Sprint 3 | Auth + Authz + Validation | Done | v1.3.0 |
| Sprint 4 | Game Logic + React UI + Deploy | In Progress | — |

**Current Blockers:**
- 401 Unauthorized errors on dashboard API calls - JWT token not being attached to requests
- CI/CD silent test failures - v1.3.0, v1.3.1, v1.3.2 released with failing tests showing as "green"

---

## Why This Sprint Order?

We implement authentication **before** full domain logic because:
1. **CDS.Security competencies are mandatory** for exam compliance
2. **Endpoints must be protected** before implementing game logic
3. The functional flows must reflect a **secure system design**

This ensures the project meets Programming, Systems Development, and Security requirements simultaneously.

---

## Sprint Details

### Sprint 1: Walking Skeleton + DevOps (Done)

**Tags:** `v1.0.0-walking-skeleton`, `v1.1.0-devops-hardening`

**Deliverables:**
- CI/CD pipeline (GitHub Actions)
- DevOps hardening (Husky, commitlint, secretlint)
- Health endpoint
- Initial folder structure
- Simple React page
- ADRs 0001–0009
- GitHub Flow branching

**Exam Competencies:**
- SDE2: CI/CD, GitHub Actions, branching strategy
- SDE2: Testing infrastructure (TestContainers)

---

### Sprint 2: Data Model + Basic Endpoints (Done)

**Branch:** `feature/data-model`

**Deliverables:**
- EF Core entities (Player, Transaction, Board, Game)
- DbContext with configurations
- Migrations
- Minimal CRUD endpoints (unprotected)
- Unit test baseline
- ADR-0010 data model decisions
- Documentation foundation (Diátaxis)

**Exam Competencies:**
- PROG: Entity Framework, GUIDs, PostgreSQL
- SDE2: Database design, migrations
- PROG: Server-side validation (DataAnnotations)

**Note:** Endpoints are unprotected in this sprint. Security is added in Sprint 3.

---

### Sprint 3: Auth + Authz + Validation (Planned)

**Priority:** CRITICAL for CDS.Security

**Deliverables:**
- JWT authentication
- Password hashing (ASP.NET Core Identity)
- Authorization policies (Admin/Player roles)
- `[Authorize]` on all endpoints
- DTO validation (DataAnnotations)
- XUnit.DependencyInjection migration
- Negative-path tests (all unhappy paths)
- Security documentation

**Exam Competencies:**
- CDS.Security: Authentication, password hashing
- CDS.Security: Authorization policies
- CDS.Security: No secrets in git
- PROG: Validation
- SDE2: XUnit.DependencyInjection, complete test coverage

---

### Sprint 4: Game Logic + React UI + Deploy (Planned)

**Deliverables:**
- Board purchase workflow (pricing, balance check)
- Weekly game completion
- Winner detection algorithm
- React UI pages (React Router)
- Fly.io deployment
- End-to-end tests
- Smoke tests in CI
- Exam presentation prep
- Final documentation polish

**Exam Competencies:**
- PROG: React + TypeScript, business logic
- CDS.Networking: Cloud deployment, Docker, Nginx
- SDE2: E2E testing, deployment pipeline

---

## Knowledge Domain Mapping

| KD | Domain | Sprint Coverage |
|----|--------|-----------------|
| KD1 | Git & Version Control | Sprint 1 |
| KD2 | CI/CD & Automation | Sprint 1, 2 |
| KD3 | Linting & Code Quality | Sprint 1 |
| KD4 | Code Generation | Sprint 1, 2 |
| KD5 | Testing Strategy | Sprint 1, 2, 3 |
| KD8 | Web API & Data Layer | Sprint 2, 4 |
| KD9 | Deployment & Cloud | Sprint 4 |
| KD10 | Auth & Session Management | Sprint 3 |
| KD11 | Authorization & Access Control | Sprint 3 |
| KD12 | Application Security | Sprint 3 |
| KD13 | Client Development | Sprint 4 |

---

## Curriculum Alignment

| Theme | Sprint |
|-------|--------|
| Branching Strategy | Sprint 1 |
| CI/CD Pipeline | Sprint 1 |
| Linting & Formatting | Sprint 1 |
| Code Generation | Sprint 2 |
| Testing Strategy | Sprint 2 |
| Git Hooks | Sprint 1 |
| Security | Sprint 3 |
| Deployment & Polish | Sprint 4 |

---

## Process Improvements Backlog

### High Priority

| Item | Description | Sprint |
|------|-------------|--------|
| CI/CD Pipeline Audit | Fix silent test failure issue affecting v1.3.0-v1.3.2 | Sprint 4 |
| Release Checklist | Implement verification checklist for all releases | Sprint 4 |
| Post-Mortem Practice | Document CI/CD issues per release | Sprint 4 |

### Medium Priority

| Item | Description | Sprint |
|------|-------------|--------|
| Test Coverage Gates | Enforce minimum coverage thresholds | Sprint 5 |
| Pipeline Observability | Add logging/metrics for CI/CD health | Sprint 5 |

---

## Definition of Done

A sprint is complete when:
- [ ] All user stories accepted
- [ ] Tests pass (unit + integration in CI)
- [ ] Documentation updated
- [ ] Code reviewed and merged
- [ ] Tagged in version control
- [ ] Exam competencies evidenced

---

## Related Documentation

### Sprint Documentation
- [Sprint 1 Review](sprint-01-review.md)
- [Sprint 1 Increment](sprint-01-increment.md)
- [Sprint 1 Retrospective](sprint-01-retrospective.md)
- [Sprint 2 Epic](sprint-02-epic.md)
- [Sprint 3 Epic](sprint-03-epic.md)
- [Sprint 4 Epic](sprint-04-epic.md)
- [MVP Definition](MVP-Definition.md)

### Architecture Decision Records
- [ADR-0007: DevOps Hardening](../adr/0007-devops-hardening-and-git-hooks.md)
- [ADR-0008: Shadow PC Testing](../adr/0008-shadow-pc-and-ci-only-testing.md)
- [ADR-0009: GitHub Flow](../adr/0009-github-flow-branching-strategy.md)
- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)

### Reference
- [Data Model Specification](../reference/data-model.md)
- [Knowledge Domains](../explanation/knowledge-domains.md)
