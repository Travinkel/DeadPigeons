# Git Settings and Branch Protection

## Where to configure
- GitHub â†’ Repository â†’ Settings â†’ Code and automation â†’ Rulesets â†’ **main** (default branch protections)
- GitHub Secrets: Settings â†’ Secrets and variables â†’ Actions

## Branch protection (main) - student-friendly
- Only PRs can modify `main` (no direct pushes, no deletions, no force-push/history rewrite)
- Require pull requests before merge
  - 1 approving review; resolve all conversations
  - Squash merge only
  - Copilot code review optional (enable if helpful)
- Require status checks (up-to-date branch):
  - build
  - test-unit
  - test-integration
  - test-frontend (Playwright)
- Require linear history
- Signed commits optional (not enforced here)
- Restrict who can push (core maintainers); empty bypass list
- Restrict ref creation matching `main`

## Workflow
- Use feature branches (e.g., `feat/exam-prep`) and merge via PR with green checks
- Tag after merge to `main` (releases)

## Clean-up plan if `main` is polluted
1) Move work to a feature branch (`feat/exam-prep`)
2) `git fetch origin`, then `git checkout main && git reset --hard origin/main`
3) Open PR from feature branch into `main`; merge after checks
4) Tag release (e.g., v2.x.y)

## Secrets and deploy
- API deploy: `FLY_API_TOKEN` secret
- Client deploy: `FLY_CLIENT_TOKEN` secret
- Never store secrets in repo; use GitHub/Fly secrets only
- If a token leaks: `flyctl auth revoke <token>`


## Environments
- No GitHub Environments configured for this student project; rely on required status checks instead of environment approvals.

