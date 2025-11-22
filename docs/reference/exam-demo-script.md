# Dead Pigeons - Exam Demo Script

## Quick Start (5 minutes)

### 1. Show Architecture
- **Frontend:** React + TypeScript + Vite
- **Backend:** ASP.NET Core 9 Web API
- **Database:** PostgreSQL with EF Core
- **Auth:** JWT with role-based policies
- **Testing:** xUnit + Playwright E2E
- **Deployment:** Fly.io (API + Client + DB)

### 2. Live Demo Flow

#### A. Registration & Login
1. Go to `/register`
2. Create account (note: starts inactive)
3. Show validation (password requirements)
4. Go to `/login`
5. Login as admin

#### B. Admin Features
1. **Dashboard** - Show player overview
2. **Activate player** - Enable new registration
3. **Create game** - New week/year
4. **Approve deposits** - Transaction management
5. **Complete game** - Enter winning numbers

#### C. Player Features
1. Login as player
2. **Request deposit** - Add funds
3. **Purchase board** - Select numbers (5-8)
4. **View boards** - See purchased boards
5. **Check results** - View game history

### 3. Code Highlights

#### Authentication (CDS.Security)
```
server/DeadPigeons.Api/Controllers/AuthController.cs
- JWT token generation
- Password hashing with Identity
- Role-based claims
```

#### Authorization Policies
```
server/DeadPigeons.Api/Program.cs:25-45
- Admin policy
- Player policy
- [Authorize] attributes
```

#### EF Core (Programming II)
```
server/DeadPigeons.DataAccess/AppDbContext.cs
- Entity configurations
- Relationships
- Migrations
```

#### React Router (Programming II)
```
client/src/routes/router.tsx
- Protected routes
- Role-based access
- Layout nesting
```

#### Testing (SDE2)
```
tests/DeadPigeons.IntegrationTests/
- TestContainers
- Real PostgreSQL
- API integration tests

client/e2e/
- Playwright E2E tests
- Auth flow coverage
```

### 4. CI/CD Pipeline (SDE2)
```
.github/workflows/ci.yml
- Build & test on PR
- Lint & typecheck
- Deploy to Fly.io on main
```

---

## Security Matrix

| Resource | Admin | Player | Unauthenticated |
|----------|-------|--------|-----------------|
| Login/Register | ✓ | ✓ | ✓ |
| Dashboard | ✓ | ✓ | ✗ |
| Admin Panel | ✓ | ✗ | ✗ |
| View Own Boards | ✓ | ✓ | ✗ |
| Purchase Board | ✓ | ✓ | ✗ |
| Create Game | ✓ | ✗ | ✗ |
| Complete Game | ✓ | ✗ | ✗ |
| View Transactions | ✓ | Own only | ✗ |
| Approve Deposits | ✓ | ✗ | ✗ |
| Activate Players | ✓ | ✗ | ✗ |

---

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Client (Fly)   │────▶│   API (Fly)     │
│  React + Vite   │     │  ASP.NET Core   │
│  Static files   │     │  Port 8080      │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  PostgreSQL     │
                        │  (Fly Postgres) │
                        └─────────────────┘
```

**URLs:**
- Client: https://deadpigeons-client.fly.dev
- API: https://deadpigeons-api.fly.dev
- Swagger: https://deadpigeons-api.fly.dev/swagger

---

## Key ADRs to Reference

1. **ADR-0011:** JWT Authentication
2. **ADR-0012:** NSwag Client Generation
3. **ADR-0015:** Fly.io Two-App Deployment

---

## Test Commands

```bash
# Backend tests
dotnet test DeadPigeons.sln

# E2E tests
cd client && npm test

# Run locally
dotnet run --project server/DeadPigeons.Api
cd client && npm run dev
```

---

## Exam Competencies Covered

| Course | Competency | Evidence |
|--------|------------|----------|
| **PROG** | React + TypeScript | All client pages |
| **PROG** | EF Core + LINQ | GameService, BoardService |
| **PROG** | Form validation | react-hook-form |
| **SDE2** | Git/GitHub Flow | Feature branches, PRs |
| **SDE2** | CI/CD | GitHub Actions |
| **SDE2** | Testing | xUnit, Playwright |
| **CDS.Security** | JWT Auth | AuthController |
| **CDS.Security** | Authorization | Policies, roles |
| **CDS.Networking** | Docker | Dockerfile, Fly.io |
