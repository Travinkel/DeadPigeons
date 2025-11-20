# ADR 0002 – Client Folder Structure and CI Linting

## Status

Accepted

## Context

The initial setup created a React app nested under `client/deadpigeons-client/`.
This caused confusion and CI friction:

- CI needed to know which folder contained `package.json`.
- Local commands (`npm run lint`, `npm run build`) had to be run in the nested
  directory.
- There was a risk of drift if multiple `package.json` files appeared.

We want a **single, obvious** client root with a predictable entry point for
developers and CI.

## Decision

We will:

- Use `client/` as the **root folder** for the React application.
  - `client/package.json` is the canonical package file.
  - `client/` contains `src/`, `public/`, `tsconfig*.json`, `vite.config.ts`,
    and lint/format configs.
- Remove the nested `client/deadpigeons-client/` structure from the repo.
- Configure CI to:
  - Run `npm ci` with `working-directory: client`.
  - Run `npm run lint` and `npm run build` with `working-directory: client`.

## Alternatives Considered

### Keep nested structure (`client/deadpigeons-client/`)

- Pros:
  - Matches Vite scaffold defaults if created inside `client/`.
- Cons:
  - Confusing file paths.
  - CI needs extra configuration.
  - Higher risk of duplicate `node_modules` or `package.json` files.

### Move client out of `client/` to `/frontend` or `/apps/web`

- Pros:
  - Clear separation if there were many apps.
- Cons:
  - Unnecessary abstraction for a single client app.
  - Adds indirection without current benefit.

## Consequences

### Positive

- Simpler mental model: “client lives in `/client`”.
- CI configuration is straightforward and less error-prone.
- All frontend linting, formatting, and build tooling is anchored to one root.

### Negative

- One-time migration needed:
  - Move files.
  - Update CI.
  - Clean stray `node_modules` and lock files.

## Risks and Mitigations

- **Risk**: CI still points to the old folder.
  - **Mitigation**: Ensure GitHub Actions steps use `working-directory: client`
    and run `npm ci` before lint/build.
- **Risk**: Old nested app left on disk or in git history.
  - **Mitigation**: Remove `client/deadpigeons-client/` from the repo; ensure
    only `client/` is tracked.

## Follow-up Actions

- Keep a single `package.json` and `node_modules` under `client/`.
- Document commands in:
  - `docs/tutorial/getting-started.md`
  - `docs/tutorial/running-project.md`
