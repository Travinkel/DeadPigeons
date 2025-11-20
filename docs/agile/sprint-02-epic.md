# Sprint 2 EPIC - DevOps Hardening

**Epic ID:** EPIC-02
**Sprint:** 2
**Branch:** `feature/devops-hardening`
**Status:** In Progress

## Epic Summary

Establish robust development workflow automation and quality gates to ensure consistent code quality, prevent accidental secret leaks, and enforce conventional commits across the team.

## Business Value

- Prevents broken code from reaching main branch
- Enforces consistent commit message format for changelog generation
- Catches secrets before they enter version control
- Reduces code review burden through automated checks
- Aligns with SD2 DevOps and CI/CD curriculum requirements

## Acceptance Criteria

- [ ] All commits follow conventional commit format
- [ ] Pre-commit hooks validate code quality
- [ ] Pre-push hooks run tests
- [ ] No secrets can be committed
- [ ] Main branch protected from direct pushes
- [ ] CI validates migrations, types, and builds

---

## User Stories

| Story ID | User Story | Acceptance Criteria | Tasks |
|----------|------------|---------------------|-------|
| US-2.1 | As a developer, I need enforced commit conventions so that changelogs can be auto-generated and commit history is readable | Commits rejected if not following conventional format | TASK-2.3 |
| US-2.2 | As a developer, I need automatic linting on staged files so that code quality is maintained without manual effort | Only staged files are linted; failures block commit | TASK-2.1, TASK-2.2, TASK-2.5 |
| US-2.3 | As a code reviewer, I need CI quality gates so that PRs are validated automatically before review | CI runs typecheck, tests, secret scan, migration check | TASK-2.8 |
| US-2.4 | As a team lead, I need branch protection so that main remains stable and all changes go through PR | Direct pushes to main blocked; PRs require CI pass | TASK-2.7 |
| US-2.5 | As a security-conscious developer, I need secret detection so that credentials never enter version control | Commits with secrets are blocked with clear error | TASK-2.4 |
| US-2.6 | As a developer, I need pre-push validation so that broken code doesn't reach the remote | Tests run before push; failures block push | TASK-2.6 |
| US-2.7 | As an operator, I need environment validation so that missing config is caught at startup | App fails fast with clear error if vars missing | TASK-2.9 |

## Why These User Stories Matter

- **Commit conventions** produce clean history for the examiner and allow automated release notes.
- **Secretlint** directly satisfies CDS.Security teaching goals (secure development practices).
- **Husky + lint-staged** align with SD2 "Developer Experience & Tooling".
- **Pre-push tests** prevent broken features from reaching PR stage.
- **Environment validation** prevents hidden runtime bugs during the exam demo.

---

## Curriculum Alignment (SDE2)

| Week | Theme | Tasks | Evidence |
|------|-------|-------|----------|
| W40 | Linting & Formatting | TASK-2.2 | lint-staged config, ESLint integration |
| W43 | Git Hooks | TASK-2.1, TASK-2.3, TASK-2.5, TASK-2.6 | Husky setup, pre-commit/pre-push hooks |
| W44 | Environments & Config | TASK-2.9 | .env validation, startup checks |

---

## Diátaxis Links

| Type | Topic | Location |
|------|-------|----------|
| **Tutorial** | Setting up Husky and Git hooks | docs/tutorials/husky-setup.md |
| **How-To** | Configure pre-commit hooks | docs/how-to/pre-commit-hooks.md |
| **How-To** | Add commitlint to project | docs/how-to/commitlint.md |
| **Reference** | commitlint.config.js | Root config file |
| **Reference** | .secretlintrc.json | Root config file |
| **Reference** | lint-staged configuration | package.json |
| **Explanation** | Why DevOps hardening matters | docs/explanation/devops-hardening.md |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hooks slow down development | Medium | Low | Use lint-staged to only check staged files |
| Team unfamiliar with conventional commits | Medium | Medium | Document format, provide examples |
| Hooks bypass possible | Low | High | CI also enforces all checks |
| secretlint false positives | Medium | Low | Configure ignore patterns |

---

## Sprint Backlog

### TASK-2.1: Add Husky
**Story Points:** 2
**Priority:** High

**Description:** Install and configure Husky for Git hooks management.

**Acceptance Criteria:**
- [ ] Husky installed as dev dependency
- [ ] `.husky/` directory created
- [ ] `prepare` script in package.json installs hooks
- [ ] Hooks execute on git operations

**Implementation:**
```bash
cd client
npm install -D husky
npx husky init
```

---

### TASK-2.2: Add lint-staged
**Story Points:** 2
**Priority:** High

**Description:** Configure lint-staged to run linters only on staged files.

**Acceptance Criteria:**
- [ ] lint-staged installed
- [ ] Configuration in package.json or .lintstagedrc
- [ ] Runs ESLint on staged .ts/.tsx files
- [ ] Runs Prettier on staged files
- [ ] Integrated with Husky pre-commit hook

**Implementation:**
```bash
npm install -D lint-staged
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

---

### TASK-2.3: Add commitlint
**Story Points:** 2
**Priority:** High

**Description:** Enforce conventional commit message format.

**Acceptance Criteria:**
- [ ] commitlint installed with conventional config
- [ ] Husky commit-msg hook validates messages
- [ ] Rejects non-conventional commits
- [ ] Team documented on commit format

**Implementation:**
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

**Commit Format:**
```
type(scope): subject

feat(auth): add JWT token refresh
fix(api): handle null response
docs(readme): update installation steps
```

---

### TASK-2.4: Add secretlint
**Story Points:** 3
**Priority:** Critical

**Description:** Prevent secrets from being committed to repository.

**Acceptance Criteria:**
- [ ] secretlint installed
- [ ] Configuration detects common secret patterns
- [ ] Pre-commit hook blocks commits with secrets
- [ ] CI also runs secretlint

**Implementation:**
```bash
npm install -D secretlint @secretlint/secretlint-rule-preset-recommend
```

```json
// .secretlintrc.json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend"
    }
  ]
}
```

---

### TASK-2.5: Configure pre-commit hook
**Story Points:** 2
**Priority:** High

**Description:** Set up pre-commit hook to run quality checks.

**Acceptance Criteria:**
- [ ] Runs lint-staged
- [ ] Runs secretlint
- [ ] Runs TypeScript type check
- [ ] Blocks commit on failure

**Implementation:**
```bash
# .husky/pre-commit
npx lint-staged
npx secretlint "**/*"
npm run typecheck
```

---

### TASK-2.6: Configure pre-push hook
**Story Points:** 2
**Priority:** High

**Description:** Run tests before allowing push to remote.

**Acceptance Criteria:**
- [ ] Runs client tests
- [ ] Optionally runs backend tests
- [ ] Blocks push on test failure

**Implementation:**
```bash
# .husky/pre-push
npm run test --prefix client
dotnet test DeadPigeons.sln
```

---

### TASK-2.7: Branch protection rules
**Story Points:** 1
**Priority:** High

**Description:** Configure GitHub branch protection for main.

**Acceptance Criteria:**
- [ ] No direct pushes to main
- [ ] Require PR with at least 1 approval
- [ ] Require CI to pass before merge
- [ ] Require up-to-date branch

**Implementation:**
GitHub Settings → Branches → Add rule for `main`:
- Require pull request before merging
- Require status checks to pass
- Require branches to be up to date

---

### TASK-2.8: Enhanced CI pipeline
**Story Points:** 3
**Priority:** Medium

**Description:** Add additional quality gates to CI.

**Acceptance Criteria:**
- [ ] TypeScript type checking (`tsc --noEmit`)
- [ ] Migration validation (pending migrations check)
- [ ] Docker build test
- [ ] Secretlint scan

**Implementation:**
```yaml
# Additional CI steps
- name: TypeScript type check
  run: npm run typecheck --prefix client

- name: Check for pending migrations
  run: dotnet ef migrations has-pending-changes

- name: Build Docker image
  run: docker build -t deadpigeons-api .

- name: Secret scan
  run: npx secretlint "**/*"
```

---

### TASK-2.9: Environment validation
**Story Points:** 2
**Priority:** Medium

**Description:** Validate required environment variables at startup.

**Acceptance Criteria:**
- [ ] .env.example documents all required variables
- [ ] Application fails fast if required vars missing
- [ ] Clear error messages indicate missing vars
- [ ] CI validates .env.example exists

**Implementation:**
```csharp
// Program.cs
var requiredVars = new[] { "DATABASE_URL", "JWT_SECRET" };
foreach (var v in requiredVars)
{
    if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(v)))
        throw new InvalidOperationException($"Missing required environment variable: {v}");
}
```

---

## Story Point Summary

| Task | Points |
|------|--------|
| TASK-2.1: Husky | 2 |
| TASK-2.2: lint-staged | 2 |
| TASK-2.3: commitlint | 2 |
| TASK-2.4: secretlint | 3 |
| TASK-2.5: pre-commit hook | 2 |
| TASK-2.6: pre-push hook | 2 |
| TASK-2.7: Branch protection | 1 |
| TASK-2.8: Enhanced CI | 3 |
| TASK-2.9: Env validation | 2 |
| **Total** | **19** |

## Definition of Done

- [ ] All tasks completed and merged
- [ ] CI pipeline green
- [ ] Branch protection active
- [ ] Team trained on new workflow
- [ ] Documentation updated
- [ ] Sprint review conducted

## Getting Started

```bash
# Create feature branch
git checkout main
git pull
git checkout -b feature/devops-hardening

# Begin implementation
cd client
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional secretlint @secretlint/secretlint-rule-preset-recommend
npx husky init
```
