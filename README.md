# Dead Pigeons — Exam Project (Programming II · SDII · CDS Security)

## Overview

Distributed full-stack application implementing the Jerne IF “Dead Pigeons” game.
Includes:

- React + TypeScript client
- .NET Web API + Entity Framework Core + PostgreSQL
- Authentication, Authorization
- Cloud deployment
- TestContainers + XUnit
- Full CI/CD automation

---

### Diátaxis + milestones

The documentation follows the Diátaxis model:

- Tutorials (getting-started, running the project)
- How-to guides (add migration, run tests, generate NSwag client)
- Explanations (architecture overview, data model decisions, security model)
- Reference (API surface, schema, migrations)

D-items and slices connect to these docs: each milestone and slice closes with updated explanation/reference pages and at least one how-to or tutorial where relevant. This keeps documentation and implementation synchronised instead of diverging over time.

---

# 1. Architecture

- Stateless API
- EF Core with PostgreSQL
- Soft delete everywhere
- Balance calculated from history (no “balance” column)
- NSwag client generation

See `/docs/architecture` for diagrams.

---

# 2. Security Policy (required)

- Authentication using secure password hashing
- Authorization using policies
- No secrets in Git
- Access control tables included

---

# 3. Environment, Configuration & Linting

- `.editorconfig`
- ESLint + Prettier configured
- CI verifies formatting + build correctness

---

# 4. CI/CD

See `.github/workflows`:

- CI pipeline (build, test, lint, Swagger check)
- Exam-compliance pipeline

---

# 5. Deployment

- Fly.io (API + Client)
- Dockerized server + client

---

# 6. Current State / Known Bugs

- Implemented:

  - Repo scaffolds
  - CI
  - Linting
  - API bootstrapping

- Next:
  - Data model
  - Auth baseline
  - Repeat logic

---
