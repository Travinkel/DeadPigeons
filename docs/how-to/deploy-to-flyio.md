# Deploy to Fly.io

This guide covers deploying the Dead Pigeons application to Fly.io.

## Prerequisites

- Fly.io account
- Fly CLI installed (`winget install flyctl` on Windows)

## Initial Setup

### 1. Authenticate

```bash
fly auth login
```

### 2. Create Applications

```bash
# Create API app
fly apps create deadpigeons-api --org personal

# Create client app
fly apps create deadpigeons-client --org personal
```

### 3. Provision PostgreSQL Database

```bash
# Create Postgres cluster (free tier settings)
fly postgres create --name deadpigeons-db --region arn --vm-size shared-cpu-1x --volume-size 1
```

**Interactive prompt:** You will be asked for cluster size:
```
Initial cluster size - Specify at least 3 for HA (3)
```

Enter **`1`** for a single-node setup (stays within free tier).

> **Note:** You'll see a warning about "Unmanaged Fly Postgres". This is expected for single-node setups and safe to proceed. Managed Postgres requires 3+ nodes which incurs costs.

**Free tier requirements:**
- `--vm-size shared-cpu-1x` - shared CPU (free)
- `--volume-size 1` - 1GB storage (free)
- Cluster size `1` - single node (free)

```bash
# Attach to API app (auto-sets DATABASE_URL)
fly postgres attach deadpigeons-db --app deadpigeons-api
```

### 4. Configure Secrets

```bash
# Generate a secure JWT secret (32+ characters)
# PowerShell: [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Set API secrets
fly secrets set JWT__SECRET="<your-32-char-secret>" --app deadpigeons-api
fly secrets set JWT__ISSUER="DeadPigeons" --app deadpigeons-api
fly secrets set JWT__AUDIENCE="DeadPigeons" --app deadpigeons-api
```

### 5. Get FLY_API_TOKEN for CI/CD

```bash
fly tokens create deploy --expiry 8760h
```

Add the token as `FLY_API_TOKEN` in GitHub repository secrets.

## Manual Deployment

### Deploy API

```bash
cd server/DeadPigeons.Api
fly deploy
```

### Deploy Client

```bash
cd client
fly deploy --build-arg VITE_API_URL=https://deadpigeons-api.fly.dev
```

## CI/CD Deployment

Deployments run automatically on push to `main` branch after all CI checks pass.

The workflow:
1. Builds and tests the application
2. Deploys API to Fly.io
3. Runs smoke test on API health endpoint
4. Deploys client to Fly.io
5. Runs smoke test on client

## URLs

- **API:** https://deadpigeons-api.fly.dev
- **Client:** https://deadpigeons-client.fly.dev
- **Swagger:** https://deadpigeons-api.fly.dev/swagger

## Monitoring

```bash
# View logs
fly logs --app deadpigeons-api
fly logs --app deadpigeons-client

# Check status
fly status --app deadpigeons-api
fly status --app deadpigeons-client

# SSH into container
fly ssh console --app deadpigeons-api
```

## Database Management

```bash
# Connect to database
fly postgres connect --app deadpigeons-db

# Run migrations (if needed)
fly ssh console --app deadpigeons-api --command "dotnet DeadPigeons.Api.dll --migrate"
```

## Troubleshooting

### API not starting
- Check logs: `fly logs --app deadpigeons-api`
- Verify secrets: `fly secrets list --app deadpigeons-api`
- Check DATABASE_URL is set

### Client routing issues
- Ensure nginx.conf has SPA fallback: `try_files $uri $uri/ /index.html;`

### CORS errors
- Verify client URL in API CORS config matches Fly.io URL
