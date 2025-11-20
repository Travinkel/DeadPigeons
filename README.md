# Dead Pigeons — Exam Project

**Courses:** Programming II · Systems Development II · CDS.Security · CDS.Networking

**Current Version:** `v1.2.0`
**Branch:** `main`

---

## ⚠️ Security Notice

**This branch has unprotected endpoints.** Authentication and authorization are implemented in Sprint 3. Do not deploy to production until the `feature/auth` branch is merged.

Current status:
- ✅ Data model and basic CRUD endpoints
- ❌ JWT authentication (Sprint 3)
- ❌ Authorization policies (Sprint 3)
- ❌ Protected endpoints (Sprint 3)

---

## Exam Alignment

This project fulfills the learning goals of:

| Course | Competencies Demonstrated |
|--------|---------------------------|
| **Programming II** | React + TypeScript, .NET Web API, Entity Framework, GUIDs, NSwag, server-side validation |
| **Systems Development II** | GitHub Actions CI/CD, XUnit + TestContainers, GitHub Flow, DevOps practices |
| **CDS.Security** | JWT authentication, password hashing, authorization policies, no secrets in git |
| **CDS.Networking** | Cloud deployment (Fly.io), Docker, Nginx reverse proxy |

The architecture follows the exam specification with stateless API, calculated balance, soft deletes, and PostgreSQL arrays.

---

## Security Policy

### Authentication
- JWT-based authentication with refresh tokens
- Password hashing using ASP.NET Core Identity (PBKDF2)
- Secure password requirements enforced

### Authorization Matrix

| Endpoint | Anonymous | Player | Admin |
|----------|-----------|--------|-------|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/register` | ✅ | ❌ | ✅ |
| `GET /api/players` | ❌ | ❌ | ✅ |
| `GET /api/players/{id}` | ❌ | Own only | ✅ |
| `PUT /api/players/{id}` | ❌ | Own only | ✅ |
| `DELETE /api/players/{id}` | ❌ | ❌ | ✅ |
| `GET /api/players/{id}/balance` | ❌ | Own only | ✅ |
| `POST /api/transactions/deposit` | ❌ | ❌ | ✅ |
| `POST /api/transactions/{id}/approve` | ❌ | ❌ | ✅ |
| `GET /api/transactions/pending` | ❌ | ❌ | ✅ |
| `GET /api/transactions/player/{id}` | ❌ | Own only | ✅ |
| `POST /api/boards` | ❌ | ✅ | ✅ |
| `GET /api/boards/{id}` | ❌ | Own only | ✅ |
| `GET /api/boards/player/{id}` | ❌ | Own only | ✅ |
| `GET /api/boards/game/{id}` | ❌ | ❌ | ✅ |
| `POST /api/games` | ❌ | ❌ | ✅ |
| `GET /api/games` | ❌ | ✅ | ✅ |
| `GET /api/games/active` | ❌ | ✅ | ✅ |
| `POST /api/games/{id}/complete` | ❌ | ❌ | ✅ |
| `GET /health` | ✅ | ✅ | ✅ |

### Security Practices
- No secrets in git (environment variables only)
- secretlint in pre-commit hooks
- HTTPS enforced in production
- CORS strict allowlist
- Parameterized queries via EF Core

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Client   │────▶│   .NET API      │────▶│   PostgreSQL    │
│  (TypeScript)   │     │   (Stateless)   │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        ▼                        ▼
   NSwag Client            EF Core + Npgsql
```

### Key Decisions (ADR-0010)
- **Calculated balance:** No balance column; sum of approved transactions
- **GUIDs for all PKs:** Exam requirement, prevents enumeration
- **PostgreSQL arrays:** Board numbers and winning numbers
- **Soft delete:** Player only (DeletedAt timestamp)
- **Players inactive by default:** Admin must activate

### Branching Strategy
- **GitHub Flow:** Feature branches → PR → main
- **Conventional Commits:** Enforced by commitlint
- **Quality Gates:** Husky, lint-staged, secretlint

---

## Quick Start

### Prerequisites
- .NET 9 SDK
- Node.js 20+ and npm
- PostgreSQL (local or Docker)
- Docker Desktop (for Testcontainers)

### Run Locally

```bash
# Terminal 1 — API
dotnet run --project server/DeadPigeons.Api

# Terminal 2 — Client
cd client && npm install && npm run dev
```

- **API Swagger:** http://localhost:5000/swagger
- **Client:** http://localhost:5173

### Run Tests

```bash
# Unit tests (run locally)
dotnet test tests/DeadPigeons.Tests

# All tests including integration (requires Docker)
dotnet test
```

### Database Migrations

```bash
# Add migration
dotnet ef migrations add MigrationName \
  --project server/DeadPigeons.DataAccess \
  --startup-project server/DeadPigeons.Api

# Apply migrations
dotnet ef database update \
  --project server/DeadPigeons.DataAccess \
  --startup-project server/DeadPigeons.Api
```

---

## Environment & Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ConnectionStrings__Default` | PostgreSQL connection string | Yes |
| `Jwt__Secret` | JWT signing key (min 32 chars) | Yes |
| `Jwt__Issuer` | JWT issuer | Yes |
| `Jwt__Audience` | JWT audience | Yes |

### Configuration Files
- `appsettings.json` — Base configuration
- `appsettings.Development.json` — Local development
- `.env.example` — Environment variable template

### Linting & Formatting
- **ESLint + Prettier** — Client code quality
- **EditorConfig** — Consistent formatting
- **commitlint** — Conventional commit messages
- **secretlint** — Credential leak detection

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **Client:** `npm ci` → `lint` → `typecheck` → `build`
2. **API:** `restore` → `build` → `test`
3. **Quality:** secretlint scan

All tests use XUnit with TestContainers for database isolation.

---

## Deployment

### Production Stack
- **Fly.io** — API + Client hosting
- **Docker** — Containerized services
- **Nginx** — Reverse proxy, TLS termination

### Deploy Commands

```bash
# Deploy to Fly.io
fly deploy

# Check deployment status
fly status
```

---

## Sprint Progress

| Sprint | Focus | Status | Tag |
|--------|-------|--------|-----|
| Sprint 1 | Walking Skeleton + DevOps | Done | v1.0.0, v1.1.0 |
| Sprint 2 | Data Model + Basic Endpoints | Done | v1.2.0 |
| Sprint 3 | Auth + Authz + Validation | Planned | — |
| Sprint 4 | Game Logic + React UI + Deploy | Planned | — |

---

## Current State

### What Works (v1.1.0)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ DevOps hardening (Husky, commitlint, secretlint)
- ✅ Health endpoint operational
- ✅ NSwag TypeScript client generation
- ✅ TestContainers integration test infrastructure
- ✅ Swagger/OpenAPI documentation

### Completed (Sprint 2)
- ✅ EF Core entities (Player, Transaction, Board, Game)
- ✅ Database migrations
- ✅ Basic CRUD endpoints (unprotected)
- ✅ Unit test suite (30 tests)
- ✅ Integration test suite (5 tests)

### Planned
- ⏳ JWT authentication
- ⏳ Authorization policies
- ⏳ React UI pages
- ⏳ Fly.io deployment

---

## Known Issues & Limitations

| Issue | Status | Notes |
|-------|--------|-------|
| No Docker locally (Shadow PC) | Workaround | Integration tests run in CI only |
| Endpoints not protected | Sprint 3 | Auth implementation pending |
| No React UI | Sprint 4 | Client pages pending |
| Not deployed | Sprint 4 | Fly.io deployment pending |

---

## Documentation

Follows the **Diátaxis** documentation model:

- **Tutorials:** `docs/tutorial/` — Getting started guides
- **How-To:** `docs/howto/` — Task-oriented guides
- **Explanation:** `docs/explanation/` — Architecture decisions
- **Reference:** `docs/reference/` — API and data model specs

### Key Documents
- [Roadmap](docs/agile/roadmap.md)
- [Data Model Reference](docs/reference/data-model.md)
- [Knowledge Domains](docs/explanation/knowledge-domains.md)
- [ADR-0010: Data Model Decisions](docs/adr/0010-data-model-decisions.md)

---

## Exam Information

- **Project Announcement:** November 13, 2024
- **Review Meetings:** November 26-27, 2024
- **Submission Deadline:** December 19, 2024
- **Oral Exams:** January 5-16, 2025

### Exam Format
- **Programming + CDS:** 30 minutes oral
- **Systems Development:** 20 minutes oral

---

## License

MIT License — See [LICENSE](LICENSE) for details.
