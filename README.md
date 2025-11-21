# Dead Pigeons — Exam Project

**Courses:** Programming II · Systems Development II · CDS.Security · CDS.Networking

**Current Version:** `v1.3.0`
**Branch:** `main`

---

## Security Policy

### Authentication
- JWT-based authentication
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
- **GUIDs for all PKs:** Prevents enumeration attacks
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

Integration tests use XUnit with TestContainers for database isolation. Unit tests use in-memory database.

---

## Deployment

### Production Stack (Planned)
- **Fly.io** — API + Client hosting
- **Docker** — Containerized services
- **Nginx** — Reverse proxy, TLS termination

> **Note:** Deployment configuration (`fly.toml`) will be added in Sprint 4.

---

## Sprint Progress

| Sprint | Focus | Status | Tag |
|--------|-------|--------|-----|
| Sprint 1 | Walking Skeleton + DevOps | Done | v1.0.0, v1.1.0 |
| Sprint 2 | Data Model + Basic Endpoints | Done | v1.2.0 |
| Sprint 3 | Auth + Authz + Validation | Done | v1.3.0 |
| Sprint 4 | Game Logic + React UI + Deploy | Planned | — |

---

## Current State

### What Works (v1.3.0)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ DevOps hardening (Husky, commitlint, secretlint)
- ✅ Health endpoint operational
- ✅ NSwag TypeScript client generation
- ✅ TestContainers integration test infrastructure
- ✅ Swagger/OpenAPI documentation
- ✅ EF Core entities (Player, Transaction, Board, Game)
- ✅ Database migrations
- ✅ Basic CRUD endpoints
- ✅ JWT authentication
- ✅ Authorization policies (Admin/Player)
- ✅ Password hashing (PBKDF2)
- ✅ DTO validation (DataAnnotations)
- ✅ CORS and security headers

### Test Suite
- ✅ Unit tests with xUnit (40 tests)
- ✅ Integration tests with TestContainers (PostgreSQL)
- ✅ Constructor injection DI pattern

### Planned (Sprint 4)
- ⏳ React UI pages
- ⏳ Fly.io deployment
- ⏳ Game logic implementation
- ⏳ Test coverage audit

---

## Known Issues & Limitations

| Issue | Status | Notes |
|-------|--------|-------|
| No Docker locally (Shadow PC) | Workaround | Integration tests run in CI only |
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

## License

MIT License — See [LICENSE](LICENSE) for details.
