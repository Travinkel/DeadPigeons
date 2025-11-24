# How-to: Recover Production Logins on Fly

Audience: incident response for failed production logins when CI is green.

Prereqs: `flyctl` logged in, access to Neon, and the latest seeder changes already merged to the feature branch you deploy from.

## 1) Deploy the updated API image

```bash
flyctl deploy --config server/DeadPigeons.Api/fly.toml --dockerfile server/DeadPigeons.Api/Dockerfile -a deadpigeons-api
```

- Wait for deploy to finish; do not restart machines until the image is available.

## 2) Restart to force migrations + seeding

```bash
fly machines restart -a deadpigeons-api
```

- The restart runs the new seeder (PasswordHasher + idempotent upserts).

## 3) Validate secrets match the current database

- List secrets:  
  `fly secrets list -a deadpigeons-api`
- If the DB connection string changed, set it before redeploying:  
  `fly secrets set ConnectionStrings__Default="Host=...;Username=...;Password=...;Database=..." -a deadpigeons-api`
- If using `DATABASE_URL`, update it to the same values and redeploy.

## 4) Confirm migrations and seed ran

```bash
fly logs -a deadpigeons-api --since 15m
```

- Look for “Applying migration” and “Seed completed”. Absence means the restart did not pick up the new image or configuration.

## 5) Clean stale users if hashes are old

- In Neon, delete `admin@jerneif.dk` and `player@jerneif.dk` rows (or truncate `Players`), then repeat steps 1–2. The seeder rewrites PBKDF2 hashes.

## 6) Verify production logins

- admin@jerneif.dk / Admin123!  
- player@jerneif.dk / Player123!

If failures persist, capture logs around startup and check for connection string errors or migration failures before re-running the deploy.
