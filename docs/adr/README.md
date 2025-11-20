# Architecture Decision Records (ADRs)

An ADR captures a single, significant decision that affects the architecture or key technical direction. Assessors care because ADRs show traceable context, alternatives, decisions, and consequences tied to exam milestones (D‑items).

## What is an ADR?

- Context — why a decision was needed
- Options — alternatives considered
- Decision — the chosen option
- Consequences — expected impact, risks, and follow‑ups

## ADR Index (current)

- 0001 — Walking Skeleton and Project Structure
  - Rationale for end‑to‑end skeleton and CI from day one
- 0002 — Client Folder Structure and CI Linting
  - Flatten client to `client/`, enforce ESLint flat config in CI
- 0003 — ESLint Flat Config and Legacy Config Deprecation
  - Standardize on ESLint 9 flat config; remove `.eslintrc*`
- 0004 — Walking Skeleton uses Docker (compose) for parity
  - Minimal compose for DB (and optional proxy) to mirror CI/deploy topology while keeping local DX fast
- 0005 — Containerisation and Distributed Runtime
  - All services run as containers in CI and production; images are the deploy unit; separation of proxy, API, DB
- 0006 — Use PostgreSQL and EF Core
  - Choose Postgres + EF Core with code‑first migrations and Testcontainers

## When to write a new ADR

- Introducing a new technology or major dependency
- Changing a previously accepted decision
- Defining cross‑cutting patterns (auth model, logging, deployment strategy)
- Any decision that examiners might question during defense

## Ties to D‑items and SDII

- D1–D7 checklists reference ADRs as evidence of deliberate design
- SDII emphasizes CI/CD and code generation; ADRs make these choices explicit

## Cross‑links

- Architecture Overview — Distributed Architecture & Containerisation Strategy
- Process & Quality — Agile + D‑items
- CI & Quality
