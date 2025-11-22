# ADR 0003 – ESLint Flat Config and Legacy Config Deprecation

## Status

Accepted

## Context

The React client uses ESLint 9, which encourages the **flat config** format
(`eslint.config.js`). The initial setup included a mix of:

- `eslint.config.js` (flat config)
- Legacy `.eslintrc.*` files

This dual configuration caused problems:

- ESLint attempted to resolve plugins from both configs.
- CI reported `ERR_MODULE_NOT_FOUND` errors for plugins such as
  `eslint-plugin-react` and `eslint-plugin-import`.
- Behaviour could differ between local and CI runs.

We need a single, predictable ESLint configuration compatible with ESLint 9.

## Decision

We will:

- Use **only** the ESLint **flat config** (`eslint.config.js`) in the client.
- Remove legacy ESLint config files from the client:
    - `.eslintrc.js`, `.eslintrc.cjs`, `.eslintrc.json` (if present).
- Ensure all plugins referenced in `eslint.config.js` are installed as
  devDependencies in `client/package.json`, for example:
    - `eslint`
    - `typescript-eslint` (replaces `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`)
    - `eslint-plugin-react`
    - `eslint-plugin-react-hooks`
    - `eslint-plugin-import`
    - `eslint-config-prettier` (if used)

CI will run:

- `npm ci` in `client/`
- `npm run lint` in `client/` (which uses the flat config)

## Alternatives Considered

### Keep legacy `.eslintrc.*` and remove flat config

- Pros:
    - Aligns with older ESLint documentation.
- Cons:
    - ESLint 9 pushes flat config as the primary model.
    - More friction when using newer tooling and examples.

### Use both configs in parallel (not recommended)

- Pros:
    - Might ease transition temporarily.
- Cons:
    - Confusing precedence rules.
    - High chance of plugin resolution and path issues.
    - Inconsistent behaviour between environments.

## Consequences

### Positive

- One ESLint configuration source of truth.
- Fewer “plugin not found” runtime errors.
- Simpler onboarding for future contributors.

### Negative

- Requires migrating any rules previously defined only in `.eslintrc.*` into
  `eslint.config.js`.
- Requires ensuring all plugins are correctly declared and installed.

## Risks and Mitigations

- **Risk**: Flat config references a plugin that is not installed.
    - **Mitigation**: Add a one-time check to match `eslint.config.js` imports
      against `devDependencies`. CI will fail early if a plugin is missing.
- **Risk**: Behaviour changes slightly when migrating rules.
    - **Mitigation**: Run `npm run lint` locally and in CI, fix any new warnings
      or errors, and adjust rules where appropriate.

## Follow-up Actions

### Evidence

- Repo path: `client/eslint.config.js`; legacy `.eslintrc*` removed
- CI logs: ESLint 9 flat config runs clean in PRs

### Consequences for exam goals (2–3 lines)

- Stable linting baseline improves code quality signal for assessors.
- Prevents “plugin not found” CI failures that waste exam time.
- Aligns tooling with current ESLint guidance for longevity.
- Document the linting setup in:
    - `docs/explanation/ci-quality.md`
- Keep lint commands in `package.json` stable (`npm run lint`, `npm run lint:fix`).