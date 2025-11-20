# Dead Pigeons — Exam Project (Programming II · SDII · CDS Security)

**Current Version:** `v1.1.0-devops-hardening`
**Previous Milestone:** `v1.0.0-walking-skeleton`

## Overview

Distributed full-stack application implementing the Jerne IF "Dead Pigeons" game.

### Features
- React + TypeScript client (Vite)
- .NET 9 Web API + Entity Framework Core + PostgreSQL
- NSwag-generated TypeScript API client
- TestContainers + xUnit integration tests
- Full CI/CD automation (GitHub Actions)

### Development Workflow
- **Branching Strategy:** GitHub Flow (feature branches → PR → main)
- **Commit Format:** Conventional Commits (enforced by commitlint)
- **Quality Gates:** Husky pre-commit hooks, lint-staged, secretlint

### Milestones
| Version | Name | Status |
|---------|------|--------|
| v1.0.0 | Walking Skeleton | Done |
| v1.1.0 | DevOps Hardening | Done |
| v1.2.0 | Data Model + Migrations | Planned |
| v1.3.0 | Authentication | Planned |

---

## Quick Start

### Prerequisites

- .NET 9 SDK
- Node.js 20+ and npm
- Docker Desktop (for Testcontainers and local services)
- PostgreSQL (local install or via Docker)

### Local Development Notes

**Shadow PC Environment:** Docker is not available locally due to Shadow PC limitations. Integration tests (which use Testcontainers) run only in CI via GitHub Actions.

**What runs locally:**
- Client development server (`npm run dev`)
- API development server (`dotnet run`)
- Linting, formatting, type checking
- Pre-commit hooks (lint-staged, secretlint, commitlint)

**What runs only in CI:**
- Integration tests (Testcontainers + PostgreSQL)
- Full test suite
- Docker builds

### Run Locally

```bash
# Terminal 1 — API
dotnet run --project server/DeadPigeons.Api

# Terminal 2 — Client
cd client && npm install && npm run dev
```

- API Swagger UI: http://localhost:5000/swagger
- Client: http://localhost:5173

### Run Tests

```bash
# All tests (unit + integration)
dotnet test

# Single test by name
dotnet test --filter "FullyQualifiedName~TestMethodName"
```

Note: Integration tests use Testcontainers and will automatically start PostgreSQL.

### Run with Docker

```bash
# Start all services
docker compose up

# Or rebuild and start
docker compose up --build
```

Services:
- API: http://localhost:8081
- Client: http://localhost:5173
- Nginx proxy: http://localhost:8080
- PostgreSQL: localhost:5432

### Generate API Client

```bash
# Install NSwag globally (one-time)
dotnet tool install -g NSwag.ConsoleCore

# Regenerate TypeScript client
nswag run nswag.json
```

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

- **Sprint 1 Complete (v1.0.0-walking-skeleton):**
  - Repo scaffolds
  - CI pipeline (build, test, lint)
  - Linting (ESLint + Prettier)
  - API bootstrapping with health endpoint
  - NSwag TypeScript client generation
  - Testcontainers integration tests

- **Sprint 2 In Progress:**
  - Husky + Git hooks
  - commitlint (conventional commits)
  - secretlint (secret detection)
  - lint-staged
  - Enhanced CI quality gates

- **Next Sprints:**
  - Authentication & Authorization
  - Core domain & boards system
  - Deployment & polish

---
