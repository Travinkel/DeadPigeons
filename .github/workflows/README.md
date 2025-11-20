# Dead Pigeons 🐦 – Exam Project (Programming II + SDII + CDS Security)

This repository hosts the full-stack implementation of the _Dead Pigeons_ game
for Jerne IF.

## Layout

- `server/DeadPigeons.Api` – .NET Web API
- `server/DeadPigeons.DataAccess` – EF Core data access
- `tests/DeadPigeons.Tests` – XUnit test project
- `client/deadpigeons-client` – React + TypeScript client

CI is configured via GitHub Actions (`.github/workflows/ci.yml`) to build and
test the solution on every push and pull request.
