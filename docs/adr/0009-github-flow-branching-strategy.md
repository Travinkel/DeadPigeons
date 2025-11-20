# ADR-0009: GitHub Flow Branching Strategy

## Status
Accepted

## Date
2025-11-20

## Context

A consistent branching strategy is required for:
- Collaborative development
- Code review processes
- CI/CD integration
- Release management

Common strategies include:
- **Git Flow:** Complex, with develop, release, and hotfix branches
- **GitHub Flow:** Simple, feature branches merged directly to main
- **Trunk-Based Development:** Frequent commits to main with feature flags

## Decision

We will use **GitHub Flow** as our branching strategy.

### Workflow

1. **Main branch** is always deployable
2. Create **feature branches** from main: `feature/description`
3. Commit with **conventional commit messages**
4. Open **Pull Request** for code review
5. CI validates the PR (build, test, lint)
6. Merge to main after approval
7. Tag releases with semantic versioning

### Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/short-description` | `feature/devops-hardening` |
| Bugfix | `fix/short-description` | `fix/nswag-runtime` |
| Documentation | `docs/short-description` | `docs/update-readme` |

### Commit Message Format

```
type(scope): subject

feat(auth): add JWT token validation
fix(api): handle null response in health check
docs(readme): update installation instructions
```

Enforced by commitlint with conventional-commits preset.

## Consequences

### Positive
- Simple workflow, easy to learn
- Direct path from feature to production
- Encourages small, frequent merges
- Natural fit for CI/CD
- Clear history with tagged releases

### Negative
- No staging branch for integration testing
- Requires discipline to keep main deployable
- Feature flags needed for incomplete features

### Mitigations
- Strong CI pipeline validates all PRs
- Pre-commit hooks catch issues early
- Small, focused PRs reduce risk

## Release Process

1. Complete feature branch
2. PR passes all CI checks
3. Merge to main
4. Tag with semantic version: `vX.Y.Z-milestone-name`

Example tags:
- `v1.0.0-walking-skeleton`
- `v1.1.0-devops-hardening`
- `v1.2.0-data-model`

## Curriculum Alignment

- **SDE2 W36-37:** VCS workflows and branching strategies
- **SDE2 W38-39:** CI/CD integration with branching
- **SDE2 W43:** Git hooks for workflow enforcement

## Related ADRs
- ADR-0001: Walking Skeleton and Project Structure
- ADR-0007: DevOps Hardening and Git Hooks
