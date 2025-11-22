# Network Architecture

This document describes the network architecture and trust boundaries for the Dead Pigeons application.

---

## Architecture Overview

```
┌─────────────────┐      HTTPS       ┌─────────────────┐      TCP        ┌─────────────────┐
│  React Client   │ ──────────────▶  │   .NET API      │ ──────────────▶ │   PostgreSQL    │
│  (Browser)      │   Port 443       │   (Fly.io)      │   Port 5432     │   (Fly.io)      │
│                 │                  │   :5000 (local) │                 │                 │
└─────────────────┘                  └─────────────────┘                 └─────────────────┘
        │                                    │
        │                                    │
   Trust Boundary 1                    Trust Boundary 2
   (Public Internet)                   (Internal Network)
```

---

## Trust Boundaries

### Boundary 1: Client ↔ API (Public Internet)

**Traffic:** HTTPS (TLS 1.2+)
**Port:** 443 (external Fly.io), 5000 (local development)

**Security Controls:**
- JWT Bearer authentication required
- CORS policy restricts origins
- Security headers on all responses
- Input validation via DataAnnotations
- Rate limiting (planned)

**Threats Mitigated:**
- Man-in-the-middle (TLS)
- Cross-site request forgery (CORS)
- Clickjacking (X-Frame-Options)
- XSS (X-XSS-Protection, Content-Type-Options)

### Boundary 2: API ↔ Database (Internal Network)

**Traffic:** TCP (PostgreSQL protocol)
**Port:** 5432

**Security Controls:**
- Connection string via environment variables
- Parameterized queries (EF Core)
- No direct database exposure to internet
- Fly.io private networking

**Threats Mitigated:**
- SQL injection (parameterized queries)
- Credential exposure (env vars, not in code)
- Direct database access (private network)

---

## HTTP Communication

### Request Flow

1. Client sends HTTPS request with JWT in Authorization header
2. Fly.io terminates TLS at edge
3. Request forwarded to API container on port 5000
4. API validates JWT and checks authorization policy
5. API executes business logic
6. EF Core generates parameterized SQL query
7. PostgreSQL returns results
8. API serializes response with security headers
9. Response returned to client

### Authentication Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Security Response Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## CORS Configuration

Allowed origins:
- `http://localhost:5173` (development)
- `https://deadpigeons.fly.dev` (production)

Allowed methods: All
Allowed headers: All
Credentials: Allowed

---

## Port Exposure

| Service | Local Port | External Port | Protocol |
|---------|-----------|---------------|----------|
| API (dev) | 5000 | 443 (via Fly.io) | HTTPS |
| PostgreSQL | 5432 | None | TCP (private) |
| Client (dev) | 5173 | 443 (via Fly.io) | HTTPS |

---

## Environment Variables

| Variable | Purpose | Security |
|----------|---------|----------|
| `ConnectionStrings__Default` | Database connection | Secret |
| `Jwt__Secret` | Token signing key | Secret |
| `Jwt__Issuer` | Token issuer | Config |
| `Jwt__Audience` | Token audience | Config |

All secrets are stored in:
- Fly.io secrets (production)
- Environment variables (local)
- Never in git

---

## Related Documentation

- [Security Policy](../../README.md#security-policy)
- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)
- [Sprint 3 Epic](../agile/sprint-03-epic.md)
