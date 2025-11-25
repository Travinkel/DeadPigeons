# Sprint 5 Retrospective ƒ?" Exam Prep & Mobile Polish

**Branch:** feature/sprint5-polish-ui  
**CI:** Green on lint/typecheck/Playwright locally; integration expected green when Docker/CI runs.

## What went well
- Auth UX hardened: Playwright auth suite now green after aligning heading semantics.
- Lint/typecheck stability: client scripts clean; husky/commitlint still lightweight for students.
- QA process clarified: AIƒ+"QA checklist with per-item roles and RaT checkpoints added to sprint epic.
- Integration startup stabilized: TestContainers host now starts before DbContext registration; HTTPS redirect disabled in tests to avoid 500s on /health.
- Production debugging reps: Fly.io logs + correlation IDs surfaced missing Active game and admin transaction joins quickly; fixes deployed without breaking RaT.

## What was hard
- Local integration runs blocked without Docker; reliance on CI for TestContainers slows feedback.
- Legacy encoding noise in docs (UTF-8 control chars) required cleanup.
- Heading expectations in tests drifted from UI copy; brittle selectors surfaced.
- Debugging prod-only issues: lazy loading hid empty admin transactions until explicit joins; active game promotion drifted only in Fly; CORS/JWT forwarding had to be rechecked per origin.

## Actions / Experiments
- Keep Docker running locally when touching API to avoid CI-only feedback loops.
- Prefer role/text selectors that match actual UI copy; keep brand headings as semantic <h1>/<h2>.
- Track GitHub issues in QA checklist (Batch D) with evidence before closure.
- Treat Fly.io as first-class: tail logs with correlation IDs before/after RaT runs; pin `VITE_API_URL` + CORS origins per environment and document.
- Default to explicit joins in admin/reporting endpoints to avoid lazy-loading gaps in production.

## Risks / Follow-ups
- Integration suite still needs a Docker-on rerun to confirm green outside CI.
- README may lag current state; align after RaT pass.
- Ensure TestContainers preflight documented in PR template to prevent silent skips.
- Seeder invariants must stay deterministic (single Active game, ISOWeek labels, demo board bound to active) or Fly can diverge from local; monitor after migrations.

## What we learned
- Debugging production vs local: always compare seeds and environment variables; Fly logs plus correlation IDs exposed active-game gaps not visible locally.
- EF Core joins beat lazy loading in admin lists: explicit includes keep admin transactions populated and avoid missing data in Fly.
- Cloud debugging flow: tail Fly logs with correlation IDs, confirm CORS allowlist + JWT forwarding from Vite build, and replay RaT cases against prod.
- Seeding invariants: enforce one Active game, stable week/year labels, and attach demo boards to the active game to keep RaT predictable.

## What I learned personally
Spending time in Fly.io logs with correlation IDs made me trust structured errors over guesswork; pairing explicit joins with deterministic seeds kept the Active game and admin approvals consistent between local and production. It reminded me to validate invariants (one Active game, balance from approved only) before assuming tests will cover them.
