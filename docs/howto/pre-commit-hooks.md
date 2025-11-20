# How-To: Configure Pre-commit Hooks

## Add a New Check to Pre-commit

Edit `.husky/pre-commit`:

```bash
# Add your command
npx your-tool "**/*"
```

## Customize lint-staged

Edit `package.json` at root:

```json
"lint-staged": {
  "client/src/**/*.{ts,tsx}": [
    "npm run lint:fix --prefix client"
  ],
  "**/*.md": [
    "prettier --write"
  ]
}
```

## Add Secret Detection Exceptions

Edit `.secretlintrc.json`:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend",
      "options": {
        "allows": [
          "/example-api-key/"
        ]
      }
    }
  ]
}
```

## Skip Specific Files in Secretlint

```json
{
  "ignorePatterns": [
    "**/test-fixtures/**",
    "**/*.test.ts"
  ]
}
```

## Debug Pre-commit Failures

Run commands manually:

```bash
# Test lint-staged
npx lint-staged --debug

# Test secretlint
npx secretlint "**/*"

# Test typecheck
npm run typecheck --prefix client
```

## Disable Hook Temporarily

```bash
HUSKY=0 git commit -m "message"
```

Or use:

```bash
git commit --no-verify -m "message"
```

## Common Issues

### ESLint Errors
Fix with: `npm run lint:fix --prefix client`

### TypeScript Errors
Check: `npm run typecheck --prefix client`

### Secret Detected
Review the file and remove or add to `.secretlintignore`
