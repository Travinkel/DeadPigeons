**Purpose:** Canonical, exam-grounded requirements for the Dead Pigeons project. These requirements are sourced from Exam Information and mapped to our Knowledge Domains and delivery workflow.

---

## Req1 — Walking Skeleton & CI Spine

- [ ] Repo scaffolded: API (.NET), Client (React+TS), Tests
- [ ] CI on PR: build, test, lint, NSwag regeneration
- [ ] Swagger/OpenAPI exposed
- [ ] README explains run and CI gates

Sources: EASV Info (tech‑stack CI/CD), Programming systems intro, Systems Dev CI must‑haves.[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

## Req2 — Data Model & Migrations

- [ ] Core entities persisted with EF Core (Player, Game, Board, Deposit, User)
- [ ] Code‑first migrations committed and applied
- [ ] Integration test applies migrations (PostgreSQL TestContainers)
- [ ] DTO validation aligned with schema (required, lengths, enums)

Sources: Programming (EF + validation), Systems Dev (TestContainers).[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

## Req3 — First Endpoints & Contract

- [ ] Players: POST /players (admin), GET /players
- [ ] Boards: POST /players/{id}/boards (admin), GET /players/{id}/boards?gameWeek=YYYY-Www
- [ ] Errors use ProblemDetails with clear validation messages
- [ ] OpenAPI/Swagger live and type‑safe client generated (NSwag)

Sources: Programming (REST, Swagger/NSwag, React Router + TS).[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

## Req4 — Deployable Unit & Cloud

- [ ] Containerized services; compose for local
- [ ] Cloud deploy (e.g., [Fly.io](http://Fly.io)); health endpoint exposed
- [ ] Smoke tests post‑deploy (health, unprotected, protected)
- [ ] No secrets in git; env/secret store configured

Sources: CDS Security (deploy, secrets), Systems Dev (automation).[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

## Req5 — Authentication & Session

- [ ] Secure password hashing (Argon2id or equivalent)
- [ ] Login issues JWT in Authorization header; expiry configured
- [ ] Client stores token safely; refresh optional with HttpOnly cookie

Sources: CDS Security (authn, password safety).[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

## Req6 — Authorization & Quality

- [ ] RBAC with policies (AdminOnly, AuthenticatedUser, ResourceOwner)
- [ ] Endpoint × role matrix documented
- [ ] Tests for happy/unhappy paths (xUnit + XUnit.DependencyInjection). TestContainers for persistence
- [ ] Linting/formatting and git hooks enforced

Sources: CDS Security (authz), Systems Dev testing & automation.[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

## Req7 — OWASP & Evidence

- [ ] Probe notes (IDOR, SQLi, XSS) attached to PRs
- [ ] CORS allowlist; parameterized access via EF; no raw string SQL
- [ ] RAG Map links evidence (PRs, CI runs, deploy URLs, screenshots)

Sources: CDS Security (web security), README requirements.[link](https://www.notion.so/EASV-Info-435f59ce32ff4bb894729996e37366e7?pvs=21)

---

### Slice 1 — Core Game Flow (baseline endpoints)

- [ ] Players: POST /players (admin), GET /players
- [ ] Boards: POST /players/{id}/boards (admin), GET /players/{id}/boards?gameWeek=YYYY-Www
- [ ] Games: POST /games/{week}/end (admin)
- [ ] Authentication: POST /auth/register, POST /auth/login

---

### Traceability

- RAG Map property: Req (Execution) points to this spec
- Knowledge Domains: KD8 (API & Data), KD2 (CI/CD), KD10 (Auth), KD11 (Authz), KD12 (OWASP), KD9 (Deploy)

### Notes

- This spec is stable and course‑agnostic. For official exam phrasing and dates see EASV Info and Moodle links inside Exam Information page.
