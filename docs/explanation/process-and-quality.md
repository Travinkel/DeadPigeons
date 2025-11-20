# Process & Quality — Agile + D‑items

## Overview

This project uses a **hybrid model** that combines:

- **Agile/Scrum workflow** for engineering (slices, user stories, tasks)
- **D-items as exam milestones** for quality gates and evidence tracking
- **RAG Map** for requirement traceability
- **Diátaxis documentation** framework for clear, usable docs

---

## Agile Workflow

### Slices (Increments)

Slices are the real units of work. Each slice:

- Delivers a vertical feature (end-to-end functionality)
- Has its own branch: slice/1-core-game-flow
- Results in a PR, deploy, and demo
- Satisfies one or more D-items (exam milestones)

**Slice 1 — Core Game Flow (MVP)**

- D-items covered: D1, D2, D3, D4
- Delivers: Player and board management endpoints, minimal UI, first production deploy
- Note: D1 (Walking Skeleton) is the _first milestone within_ Slice 1. D1 proves infrastructure; Slice 1 delivers the MVP.

### User Stories

Each slice contains **3–7 user stories** written in standard format:

```
As a <role>,
I want <capability>,
So that <business value>.
```

Stories include:

- **Gherkin scenarios** (Given/When/Then) for acceptance criteria
- **Acceptance criteria** checklist
- Link to parent **Slice**

### Tasks

User stories break down into **technical tasks**:

- Implementation, Test, Docs, Refactor, Chore, Security
- Sized: XS, S, M, L, XL
- Tracked with commit references
- Example: `feat(S1): add POST /players endpoint`

### Commit Convention

**Format:** `<type>(S[n]): <description>`

**Examples:**

- `feat(S1): add POST /players`
- `test(S1): add integration test for board creation`
- `chore(D2): add initial EF migration` ← D-item reference when milestone-relevant
- `docs(S2): update authz matrix in README`

**Types:** feat, fix, test, refactor, docs, chore, style, perf

---

## D-items as Exam Milestones

### Not Work Items

D-items (D1–D7) are **NOT** engineering work items. They are:

- **Exam-aligned milestones** derived from the official brief
- **Quality gates** with explicit checklists
- **Evidence collection points** for the RAG Map

### D-item List

- **D1** — Walking Skeleton (CI, migrations, health endpoint)
- **D2** — Data Model & Migrations (EF entities, Postgres)
- **D3** — First Vertical Slice (core endpoints + tests)
- **D4** — Minimal UI + Deploy (client, NSwag, deploy URL)
- **D5** — Auth Baseline (registration, login, policies)
- **D6** — Repeats + End-game (game activation, board repeating)
- **D7** — Hardening & Docs (logs, README, evidence)

### Mapping Slices to D-items

| Slice                        | D-items Covered |
| ---------------------------- | --------------- |
| Slice 1 — Core Game Flow     | D1, D2, D3, D4  |
| Slice 2 — Auth & Security    | D5              |
| Slice 3 — End-game & Repeats | D6, D7          |

---

## Quality Gates (D-item Checklists)

Before marking a D-item "Done", verify:

### D1 Checklist

- [ ] CI pipeline green (build, test, lint)
- [ ] Initial migration created and applied
- [ ] Health endpoint returns 200 OK
- [ ] NSwag config in place
- [ ] README has run instructions

### D2 Checklist

- [ ] EF entities defined (Player, Game, Board, Deposit)
- [ ] DbContext configured with Postgres connection
- [ ] Integration test with TestContainers passes
- [ ] Migration applied in CI

### D3 Checklist

- [ ] POST /players, POST /boards, GET /boards endpoints implemented
- [ ] DTO validation on state-changing endpoints
- [ ] Integration tests pass
- [ ] NSwag TypeScript client generated in CI

### D4 Checklist

- [ ] React app deployed and accessible
- [ ] Boards list page functional
- [ ] Client uses NSwag-generated client (no manual fetch)
- [ ] Deploy URL documented

### D5 Checklist

- [ ] User registration and login implemented
- [ ] Password hashing (Argon2id/PBKDF2) verified
- [ ] Authorization policies in place
- [ ] Integration tests for 401, 403, 200 scenarios
- [ ] Authorization matrix in README
- [ ] Burp IDOR probe notes attached

### D6 Checklist

- [ ] POST /games/{week}/end implemented
- [ ] Transactional game activation verified
- [ ] Repeating boards logic tested
- [ ] Integration tests pass

### D7 Checklist

- [ ] Structured logging configured
- [ ] README complete (all required sections)
- [ ] Security policy documented
- [ ] Evidence links (PRs, test reports, deploy URL)
- [ ] No secrets in git (CI verified)

---

## RAG Map (Requirement Traceability)

The **Project RAG Map** connects:

- **Module** (Programming II, SDII, CDS Security)
- **Requirement** (quoted from module brief)
- **D-item** (exam milestone)
- **Slice** (engineering increment)
- **Evidence** (PR, test report, deploy URL)

This creates **retrieval-augmented** decision-making: when planning a slice or task, the team can look up which constraints apply rather than relying on memory.

**Example RAG Map Row:**

- Module: Programming II
- Requirement: "Use NSwag to generate TypeScript client"
- D-item: D3
- Slice: Slice 1
- Evidence: CI job artifacts, client usage in UI

---

## Diátaxis Documentation Framework

All project docs follow **Diátaxis** (4 types):

### 1. Tutorials (Learning-Oriented)

- Getting started guide
- Running the project locally
- First deployment

### 2. How-To Guides (Problem-Oriented)

- Add a new migration
- Run integration tests
- Generate NSwag client
- Add a new endpoint
- Deploy to production

### 3. Explanations (Understanding-Oriented)

- Architecture overview
- Security model
- Data model decisions
- Process & quality model (this doc)

### 4. Reference (Information-Oriented)

- API surface documentation
- Database schema
- Configuration variables
- Commit message format
- Authorization matrix

**Integration:** Each D-item and slice updates relevant docs. For example, D5 (Auth) updates:

- Explanation: Security model
- Reference: Authorization matrix
- How-to: "Add a protected endpoint"

---

## Benefits of This Model

### For Engineering

- **Clean Agile workflow** (slices, stories, tasks)
- **Industry-standard practices** (easy to explain in interviews)
- **Proper branching and commits**
- **Fast feedback loops** (slice-based deploys)

### For Exam

- **Clear D-item milestone tracking**
- **Evidence mapped to requirements**
- **RAG status visible to examiners**
- **Quality gates prevent missed requirements**
- **Traceability from requirement → slice → evidence**

### For Quality

- **Explicit checklists** catch drift early
- **RAG-style constraint retrieval** reduces reliance on memory
- **Continuous quality control** (gate before marking "Done")
- **Documentation synchronized** with implementation

---

## Process Hypothesis

The project management structure combines:

- **Diátaxis documentation** (tutorial, how-to, explanation, reference)
- **D1–D7 milestone checklists** derived from the exam brief
- **Slice-based Agile delivery** with user stories and Gherkin acceptance tests

This is based on a simple hypothesis: **explicit checklists and structured documentation reduce drift, missed requirements, and rework**. The project does not formally measure effect sizes, but uses these structures as **low-cost process constraints** to increase the probability of a clean, exam-aligned deliverable.

---

## Related Pages

- [](https://www.notion.so/1dcefe789bad4edabf4b13b31f77cc91?pvs=21)
- [](https://www.notion.so/698614b102604ea8a5a553576dd086e7?pvs=21)
- [](https://www.notion.so/83040f0c8f324277b4897b063b98fda8?pvs=21)
- [](https://www.notion.so/25cf2e3b8f90413896d8ec283178658a?pvs=21)
- [](https://www.notion.so/d053ecf2f43d4fbda4349d29d7edd817?pvs=21)
- [Agile Conventions & Rules](https://www.notion.so/Agile-Conventions-Rules-2d8e9e2356604c6a8b72a0889380faca?pvs=21)
- [How to Use Agile + Exam Structure Together](https://www.notion.so/How-to-Use-Agile-Exam-Structure-Together-b73c7d5d12e84ed9bc25a8091564af9c?pvs=21)
