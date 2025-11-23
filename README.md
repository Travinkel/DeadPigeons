# Dead Pigeons

Digital lottery game management system for Jerne IF sports club.

**Version:** `v2.1.0`
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

### Production
- **API:** https://deadpigeons-api.fly.dev
- **Client:** https://deadpigeons-client.fly.dev

### Infrastructure
- **Fly.io** — API + Client hosting
- **Neon** — PostgreSQL database
- **Docker** — Containerized services
- **Nginx** — Reverse proxy (client)

---

## Release History

| Version | Focus | Tag |
|---------|-------|-----|
| v1.0.0 | Walking Skeleton + DevOps | v1.0.0 |
| v1.2.0 | Data Model + Basic Endpoints | v1.2.0 |
| v1.3.x | Auth + Authz + Validation | v1.3.2 |
| v2.0.0 | Game Logic + React UI + Deploy | v2.0.0 |
| v2.1.0 | Database Seeder + Design System | v2.1.0 |

---

## Current State

### MVP Complete (v2.1.0)

**Backend**
- ✅ .NET 9 Web API with EF Core
- ✅ JWT authentication & role-based authorization
- ✅ All CRUD endpoints with validation
- ✅ Game logic (boards, transactions, completion)
- ✅ Database seeder (20 years of games)
- ✅ Swagger/OpenAPI documentation

**Frontend**
- ✅ React + TypeScript SPA
- ✅ NSwag-generated API client
- ✅ Responsive design system (1.25 ratio)
- ✅ Login/Register flows
- ✅ Player & Admin dashboards
- ✅ Board purchase & game views

**DevOps**
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Fly.io deployment (API + Client)
- ✅ TestContainers integration tests
- ✅ 56+ tests passing
- ✅ Quality gates (Husky, commitlint, secretlint)

---

## Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Balance caching | Design choice | Balance calculated from transactions on each request |
| Physical participants | Out of scope | Prize calculation done manually by admin |

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
