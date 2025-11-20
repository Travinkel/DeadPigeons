# Project Roadmap

## Knowledge Domains (RAG)

| KD | Domain | Status |
|----|--------|--------|
| KD2 | CI/CD & Automation | In Progress |
| KD8 | Web API & Data Layer (.NET + EF + SQL) | In Progress |
| KD9 | Deployment & Cloud | Planned |
| KD10 | Auth & Session Management | Planned |
| KD11 | Authorization & Access Control | Planned |
| KD12 | Application Security (Web & OWASP) | Planned |

## Milestones (Quality Gates)

Milestone-oriented roadmap aligned to internal delivery gates (D1–D7).

### D1: Walking Skeleton + CI Spine
**Status:** Done
**Evidence:** ADR-0001, CI green, health endpoint
**Sprint:** 1
**Tag:** `v1.0.0-walking-skeleton`

### D2: Data Model + Migrations
**Status:** In Progress
**Evidence:** Data Model Decisions, Migrations Reference
**Sprint:** 2–3

### D3: First Endpoints + NSwag Client
**Status:** In Progress
**Evidence:** API Reference, NSwag Strategy
**Sprint:** 2–3

### D4: Deployment (Containerized)
**Status:** In Progress
**Evidence:** Deploy How-to (Nginx), smoke tests
**Sprint:** 3–4

### D5: Auth Baseline
**Status:** Planned
**Evidence:** Security Model (hashing, session), integration test auth flows
**Sprint:** 4–5

### D6: Authorization & Quality
**Status:** Planned
**Evidence:** Authorization Matrix, linting/hooks in CI
**Sprint:** 5–6

### D7: OWASP Probes & Final Evidence
**Status:** Planned
**Evidence:** Probe notes (IDOR, SQLi, XSS) attached to PRs; RAG Map links
**Sprint:** 6–7

## Sprint Overview

| Sprint | Focus | Status |
|--------|-------|--------|
| Sprint 1 | Walking Skeleton | Done |
| Sprint 2 | DevOps Hardening | In Progress |
| Sprint 3 | Core Domain & Endpoints | Planned |
| Sprint 4 | Authentication | Planned |
| Sprint 5 | Authorization | Planned |
| Sprint 6 | Security Hardening | Planned |
| Sprint 7 | Final Polish & Evidence | Planned |

## Status Legend

- Done: Completed and tagged
- In Progress: Currently in development
- Planned: Scheduled for future sprint

## Curriculum Alignment (SDE2)

| Week | Theme | Sprint Coverage |
|------|-------|-----------------|
| W36–37 | Branching Strategy | Sprint 1 |
| W38–39 | CI/CD Pipeline | Sprint 1, 2 |
| W40 | Linting & Formatting | Sprint 2 |
| W41 | Code Generation | Sprint 1 |
| W42 | Testing Strategy | Sprint 1, 2 |
| W43 | Git Hooks | Sprint 2 |
| W44 | Environments & Config | Sprint 2 |

## Diátaxis Cross-Links

### Tutorials
- [Setting up local development](../tutorials/)
- [Running integration tests](../tutorials/)

### How-To Guides
- [Adding a new migration](../how-to/)
- [Configuring Git hooks](../how-to/)

### Reference
- [API endpoints](../reference/)
- [Configuration options](../reference/)

### Explanation
- [Architecture decisions](../explanation/)
- [Security model](../explanation/)

## Sprint Mapping

- **Sprint 1 – Walking Skeleton (Done):**
  Vertical slice operational, CI baseline, NSwag pipeline.

- **Sprint 2 – DevOps Hardening (Current):**
  Husky, commitlint, secretlint, lint-staged, enhanced CI.

- **Sprint 3 – Authentication & Security:**
  JWT auth, secure password hashing, session handling.

- **Sprint 4 – Core Domain & Boards System:**
  CRUD operations, transactions, board gameplay logic.

- **Sprint 5 – Deployment & Polish:**
  Fly.io deployment, environment validation, exam review.

## Related Documentation

- [Sprint 1 Review](sprint-01-review.md)
- [Sprint 1 Increment](sprint-01-increment.md)
- [Sprint 2 Epic](sprint-02-epic.md)
