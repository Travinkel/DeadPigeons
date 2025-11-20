# ADR-0007: DevOps Hardening and Git Hooks

## Status
Accepted

## Date
2025-11-20

## Context

After completing the Walking Skeleton (Sprint 1), we need to establish development workflow automation to:
- Ensure consistent code quality across the team
- Prevent accidental secret leaks
- Enforce conventional commit messages for changelog generation
- Reduce code review burden through automated checks

This aligns with SDE2 curriculum themes:
- W40: Linting & Formatting
- W43: Git Hooks
- W44: Environments & Configuration

## Decision

We will implement the following DevOps tooling at the repository root:

### 1. Husky for Git Hooks
- Manages pre-commit, commit-msg, and pre-push hooks
- Installed at repo root to work with monorepo structure

### 2. lint-staged
- Runs linters only on staged files for performance
- Integrates with ESLint and Prettier

### 3. commitlint
- Enforces conventional commit format
- Enables automated changelog generation
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

### 4. secretlint
- Scans for accidentally committed secrets
- Uses preset-recommend ruleset
- Runs on pre-commit and in CI

### 5. Pre-push Tests
- Runs client and API tests before push
- Prevents broken code from reaching remote

### Configuration Files
- `package.json` (root) - Manages all tooling
- `commitlint.config.js` - Commit message rules
- `.secretlintrc.json` - Secret detection config
- `.husky/pre-commit` - lint-staged, secretlint, typecheck
- `.husky/commit-msg` - commitlint validation
- `.husky/pre-push` - Test execution

## Consequences

### Positive
- Consistent code quality enforced automatically
- Secrets blocked before entering version control
- Clean commit history for examiner review
- Reduced manual review effort
- Aligns with security course requirements (CDS.Security)

### Negative
- Additional setup time for new developers
- Hooks can slow down commits (mitigated by lint-staged)
- Team must learn conventional commit format

### Risks
- Hooks can be bypassed with `--no-verify` flag
- **Mitigation:** CI also enforces all checks

## Curriculum Alignment

- **SDE2 W40:** Linting & Formatting baseline
- **SDE2 W43:** Git Hooks implementation
- **SDE2 W44:** Environment & Configuration management
- **CDS.Security:** Secure development practices (secretlint)

## Related ADRs
- ADR-0001: Walking Skeleton and Project Structure
- ADR-0004: Walking Skeleton Uses Docker for Parity
