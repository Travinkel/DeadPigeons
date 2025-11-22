# ADR-0015: Fly.io Two-App Deployment Architecture

## Status

Accepted

## Context

We need to deploy the Dead Pigeons application to Fly.io for production hosting. The application consists of:
- ASP.NET Core Web API (backend)
- React SPA with Vite (frontend)

We considered two approaches:
1. **Single-app**: Reverse proxy serving both API and static files
2. **Two-app**: Separate Fly.io apps for API and client

## Decision

Deploy as **two separate Fly.io applications**:
- `deadpigeons-api` - ASP.NET Core API container
- `deadpigeons-client` - Nginx serving React SPA

## Rationale

### Why Two Apps

1. **Independent scaling** - API and client have different resource needs (API: 512MB, client: 256MB)
2. **Independent deployment** - Can deploy client fixes without touching API
3. **Clear separation of concerns** - Matches local development setup
4. **Simpler Dockerfiles** - Each optimized for its purpose
5. **Course alignment** - Matches W38 Deployment course material

### Why Not Single App

1. **Complexity** - Requires reverse proxy configuration to route `/api` vs static files
2. **Larger container** - Would need both .NET runtime and Node/nginx
3. **Coupled deployments** - Any change requires full redeploy
4. **Harder debugging** - Mixed logs and concerns

## Architecture

```
                    ┌─────────────────────┐
                    │   Fly.io Edge       │
                    │   (TLS/HTTPS)       │
                    └─────────┬───────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼─────────┐         ┌───────────▼─────────┐
    │ deadpigeons-api   │         │ deadpigeons-client  │
    │ (ASP.NET Core)    │◄────────│ (Nginx + React)     │
    │ Port 8080         │  API    │ Port 80             │
    └─────────┬─────────┘ calls   └─────────────────────┘
              │
    ┌─────────▼─────────┐
    │ Fly.io Postgres   │
    │ (deadpigeons-db)  │
    └───────────────────┘
```

## Implementation Details

### API Configuration (fly.toml)

```toml
app = "deadpigeons-api"
primary_region = "arn"  # Stockholm

[env]
  ASPNETCORE_URLS = "http://+:8080"

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
```

### Client Configuration (fly.toml)

```toml
app = "deadpigeons-client"
primary_region = "arn"

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
```

### DATABASE_URL Parsing

Fly.io Postgres provides `DATABASE_URL` in URI format:
```
postgres://user:pass@host:5432/database
```

EF Core expects connection string format:
```
Host=host;Port=5432;Database=database;Username=user;Password=pass
```

Solution: Parse at startup in Program.cs before configuration is built.

### CORS Configuration

API must allow requests from client domain:
```csharp
policy.WithOrigins(
    "http://localhost:5173",           // Dev
    "https://deadpigeons-client.fly.dev"  // Production
)
```

## Consequences

### Positive

- Clean separation matches development environment
- Smaller, faster container builds
- Independent scaling and deployment
- Demonstrates exam competencies (Docker, cloud deployment, nginx)

### Negative

- Two apps to manage instead of one
- Need to coordinate API URL in client build (`VITE_API_URL`)
- Slightly more complex CI/CD (two deploy jobs)

### Neutral

- Each app has its own logs (use `fly logs --app <name>`)
- Secrets managed per-app

## Alternatives Considered

### Single Container with Nginx Reverse Proxy

Would route `/api/*` to Kestrel and `/` to static files. Rejected due to:
- Complex nginx configuration
- Harder to debug
- Doesn't match course examples

### Static Hosting (Vercel/Netlify) + Fly.io API

Would use specialized static hosting for client. Rejected due to:
- Adds third service to manage
- Different deployment mechanisms
- Fly.io static hosting is sufficient

## Related

- [ADR-0004: Walking Skeleton Uses Docker](0004-walking-skeleton-uses-docker-for-parity.md)
- [ADR-0005: Containerization and Distributed Runtime](0005-containerization-and-distributed-runtime.md)
- [How-to: Deploy to Fly.io](../how-to/deploy-to-flyio.md)
