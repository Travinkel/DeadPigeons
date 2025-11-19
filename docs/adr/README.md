# Architecture Decision Records (ADRs)

This folder contains Architecture Decision Records for Dead Pigeons.

An ADR captures a **single, significant decision** that affects the system’s
architecture or key technical direction. Each record documents:

- Context – why the decision was needed
- Options considered
- The decision itself
- Consequences and follow-up actions

## Conventions

- Files are named: `NNNN-title-with-dashes.md`
  - `NNNN` is a zero-padded sequence number (e.g., `0001`, `0002`)
- Once an ADR is **Accepted**, it is treated as immutable.
  - If the decision changes, create a new ADR and link to the old one.

## ADR Index

- `0001-walking-skeleton-and-project-structure.md`  
  Initial walking skeleton and solution structure (API + client + CI).
- `0002-client-folder-structure-and-ci-linting.md`  
  Flattening the React client to `/client` and aligning CI.
- `0003-eslint-flat-config-and-legacy-config-deprecation.md`  
  Using ESLint flat config and removing legacy `.eslintrc.*` files.
- `0004-use-postgresql-and-ef-core.md`  
  Choosing PostgreSQL + EF Core (code-first) as the data access stack.

Add new ADRs here as they are created.
