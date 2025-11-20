# Tutorial: Setting Up Git Hooks with Husky

This tutorial guides you through setting up and using the Git hooks in the Dead Pigeons project.

## Prerequisites

- Node.js 20+ installed
- Repository cloned locally
- npm dependencies installed

## Step 1: Install Dependencies

After cloning the repository, install root dependencies:

```bash
npm install
```

This automatically:
- Installs Husky, commitlint, lint-staged, and secretlint
- Runs `husky` via the `prepare` script
- Sets up Git hooks in `.husky/` directory

## Step 2: Verify Hooks Are Active

Check that hooks exist:

```bash
ls .husky/
# Should show: pre-commit, commit-msg, pre-push
```

## Step 3: Understanding the Hooks

### pre-commit
Runs before each commit:
- **lint-staged:** Lints and formats staged files
- **secretlint:** Scans for secrets
- **typecheck:** Validates TypeScript

### commit-msg
Validates commit message format:
- Must follow conventional commits
- Example: `feat(auth): add login endpoint`

### pre-push
Runs before pushing to remote:
- Executes client tests
- Runs .NET tests

## Step 4: Making Your First Commit

```bash
# Stage your changes
git add .

# Commit with conventional message
git commit -m "feat(api): add user registration endpoint"
```

If the commit message is invalid:
```
⧗   input: added stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

Correct format:
```bash
git commit -m "feat: add user registration"
```

## Step 5: Commit Types

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting (no code change) |
| refactor | Code restructuring |
| perf | Performance improvement |
| test | Adding tests |
| build | Build system changes |
| ci | CI configuration |
| chore | Other changes |

## Troubleshooting

### Hooks Not Running

```bash
# Reinstall hooks
npx husky install
```

### Bypassing Hooks (Emergency Only)

```bash
git commit --no-verify -m "emergency fix"
```

**Warning:** CI will still enforce all checks.

## Next Steps

- Learn about [commitlint configuration](../reference/commitlint-config.md)
- See [pre-commit workflow](../howto/pre-commit-hooks.md)
