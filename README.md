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