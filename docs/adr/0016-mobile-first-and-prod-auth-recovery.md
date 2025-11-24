# ADR-0016: Mobile-First UI and Production Auth Recovery Protocol

## Status
Accepted

## Context
- Production logins are failing until the Fly API is redeployed with the updated seeder and restarted so the PasswordHasher-based users are written.
- CI gates (unit, integration, E2E, smoke) can pass without guaranteeing production uses the latest database seed or secrets.
- Sprint 5 requires UI hardening; auth and core flows must be usable on mobile widths for demo/exam readiness.

## Decision
1) Treat Fly deploy + machine restart as the required path to apply seeder changes to production whenever the data model or seed logic changes.
2) Before deploy, validate Fly secrets for the database connection (`ConnectionStrings__Default` or `DATABASE_URL`) to avoid deploying against stale databases.
3) Adopt mobile-first responsive behavior as a Definition of Done for auth and core flows (minimum 360–375px width) and document breakpoints plus runbook coverage.

## Rationale
- Restarting machines ensures migrations and the new seeder run against production data; without it, old BCrypt hashes remain and logins fail.
- Explicit secrets validation prevents silent deploys that point to outdated or wrong databases.
- Mobile-first coverage is necessary for exam/demo usability and aligns with the design system tokens already in place.

## Consequences
### Positive
- Production auth recovery is repeatable: deploy → restart → verify logs/seeds.
- Reduced risk of hidden DB/secret drift between CI and production.
- Mobile usability becomes a merge criterion, not a best-effort polish.

### Negative
- Deploys that touch data now require a coordinated restart and verification step.
- Additional PR checklist items (mobile viewport checks, secret validation) may slow merges slightly.

## Follow-up Actions
- Maintain a how-to runbook for Fly production login recovery (see `docs/howto/fly-production-login-recovery.md`).
- Keep responsive guidelines in `docs/reference/responsive-guidelines.md` and add mobile viewport steps to smoke/E2E.
