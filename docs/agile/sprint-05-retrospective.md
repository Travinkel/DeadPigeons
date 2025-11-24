# Sprint 5 Retrospective — Exam Prep & Mobile Polish

**Branch:** feature/sprint5-polish-ui  
**CI:** Green on lint/typecheck/Playwright locally; integration expected green when Docker/CI runs.

## What went well
- Auth UX hardened: Playwright auth suite now green after aligning heading semantics.
- Lint/typecheck stability: client scripts clean; husky/commitlint still lightweight for students.
- QA process clarified: AI↔QA checklist with per-item roles and RaT checkpoints added to sprint epic.
- Integration startup stabilized: TestContainers host now starts before DbContext registration; HTTPS redirect disabled in tests to avoid 500s on /health.

## What was hard
- Local integration runs blocked without Docker; reliance on CI for TestContainers slows feedback.
- Legacy encoding noise in docs (UTF-8 control chars) required cleanup.
- Heading expectations in tests drifted from UI copy; brittle selectors surfaced.

## Actions / Experiments
- Keep Docker running locally when touching API to avoid CI-only feedback loops.
- Prefer role/text selectors that match actual UI copy; keep brand headings as semantic <h1>/<h2>.
- Track GitHub issues in QA checklist (Batch D) with evidence before closure.

## Risks / Follow-ups
- Integration suite still needs a Docker-on rerun to confirm green outside CI.
- README may lag current state; align after RaT pass.
- Ensure TestContainers preflight documented in PR template to prevent silent skips.
