# ADR-0012: NSwag Client Generation

## Status
Accepted

## Context
We use NSwag to generate TypeScript API clients from our OpenAPI/Swagger specification. This ensures type safety between the .NET API and React client, preventing contract drift.

However, NSwag in CI environments presents several challenges:
- Requires a running API server to fetch the OpenAPI spec
- API requires environment configuration (JWT secrets, database connection)
- Timing issues with API startup
- Port configuration mismatches

## Decision
We will use NSwag with runtime spec fetching (not static files) with the following CI workarounds:

### Configuration
- **nswag.json** points to `http://localhost:5000/swagger/v1/swagger.json`
- Port must match both `launchSettings.json` and CI workflow `--urls` parameter
- API now runs on port 5000 (updated from 5155)

### CI Workflow Requirements
1. **Environment variables** for API startup:
   ```yaml
   env:
     ConnectionStrings__Default: "Host=localhost;Database=...;..."
     Jwt__Secret: "TestSecretMin32Characters..."
     Jwt__Issuer: "DeadPigeons"
     Jwt__Audience: "DeadPigeons"
   ```

2. **Health check** instead of fixed sleep:
   ```bash
   for i in {1..30}; do
     if curl -s http://localhost:5000/swagger/v1/swagger.json > /dev/null; then
       echo "API is ready"
       break
     fi
     sleep 1
   done
   ```

3. **Client drift check** to catch uncommitted changes:
   ```bash
   git diff --exit-code client/src/api/generated/
   ```

### Local Development
Run NSwag locally after API changes:
```bash
# Start API in one terminal
dotnet run --project server/DeadPigeons.Api

# In another terminal
nswag run nswag.json
npx prettier --write client/src/api/generated/api-client.ts
```

## Consequences

### Positive
- Type-safe API client
- Automatic DTO generation
- CI catches contract drift
- No manual client maintenance

### Negative
- CI complexity (running API server)
- Timing-sensitive (health check needed)
- Requires all API dependencies (DB, JWT config)

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Connection refused | API not started or wrong port | Check port in nswag.json matches CI |
| JWT Secret not configured | Missing env vars | Add Jwt__* env vars to CI step |
| API startup timeout | Health check too short | Increase loop iterations |
| Client drift detected | Forgot to regenerate | Run `nswag run` locally and commit |

## Alternatives Considered

### Static swagger.json file
- **Pros:** No running server needed
- **Cons:** Can drift from actual API, manual updates required
- **Decision:** Rejected - runtime fetch ensures accuracy

### Swagger CLI codegen
- **Pros:** More tooling options
- **Cons:** Less .NET-native, different output format
- **Decision:** Rejected - NSwag is standard for .NET

## Related
- [ADR-0011: JWT Authentication](0011-jwt-authentication.md)
- [CI Workflow](.github/workflows/ci.yml)
- [nswag.json](../../nswag.json)
