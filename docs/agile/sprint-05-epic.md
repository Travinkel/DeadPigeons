
# Sprint 5 Epic — Exam Prep & Cleanup

**Goal:** Hardening for exam submission: fix CI integrity, restore GitHub Flow, unblock Fly deployment, and re-run gated tests.
**Duration:** Short hardening sprint (exam-prep)
**Branch:** `exam-prep` (keep `main` clean)

## Objectives

1) **CI Integrity**
- Fix TestContainers integration tests gate (apply migrations/seed, fail on error).
- Require E2E/smoke gates before release.
- Add branch protection to block direct commits to `main`.

2) **Deployment Readiness**
- Document and supply both Fly tokens (API + client app).
- Gate deploy job on token presence; fail fast when missing.

3) **Testing**
- Re-enable/rewrite E2E (TASK-4.12) and smoke tests (TASK-4.13).
- Verify integration tests green in GitHub Actions.

4) **Process Compliance**
- Move active work to `exam-prep`; cherry-pick/merge via PR into `main`.
- Update exam-alignment.md to reflect real status (tests, deploy).
- Add branch protection policy and clean `main` to GitHub Flow (reset to origin after moving work to `exam-prep`).
- Apply design tokens (text-h1…h4, h-10/h-12 controls) consistently in auth flows.
- Ensure API runs migrations on startup before seeding.

## Deliverables & Acceptance

- Branch protection enabled; no direct pushes to `main`.
- CI fails if integration/E2E/smoke fail or are skipped.
- Fly deploy succeeds with documented token setup (API + client token).
- Integration tests pass in CI (TestContainers with migrations + seed).
- E2E and smoke tests present and executable (document how/where to run).
- exam-alignment.md updated to reflect current compliance.
- Branch protection documented and enabled; plan to clean `main` agreed.
- Design tokens visible in auth UI (text-h1 etc.).
- API migrates + seeds automatically on startup.

## Risks & Mitigations

- **Token misconfiguration:** Add preflight check and docs.
- **Flaky integration tests:** Seed deterministic data; fail hard on migration errors.
- **Time:** Scope to hardening only; defer new features.

## Definition of Done (Sprint 5)

- [ ] CI gates: unit + integration + E2E + smoke wired and green in GitHub Actions
- [ ] Fly deploy job succeeds with required tokens
- [ ] `main` clean; `exam-prep` holds in-flight work
- [ ] Docs updated (exam-alignment.md, deployment notes, CI steps, branch protection)
- [ ] Design system tokens applied in UI (auth headings/buttons/inputs)
- [ ] API migrations run on startup (no missing tables in prod)
