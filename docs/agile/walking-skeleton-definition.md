# Walking Skeleton Definition — Dead Pigeons

This document outlines the requirements for the Walking Skeleton. The Walking Skeleton is considered complete when all technical and infrastructure tasks listed below are successfully implemented and automated.

The purpose of the Walking Skeleton is to establish a solid technical foundation for the project. It ensures that the core infrastructure, continuous integration, and deployment pipelines are in place before any significant feature development begins. This de-risks the development process by front-loading critical technical decisions and integrations.

---

## 1. Technical Requirements & Infrastructure Gates

The Walking Skeleton is defined by the following technical capabilities and infrastructure setup. There are no domain-specific features in the Walking Skeleton; it is purely a technical slice.

### Source Control & Repository
-   [x] **Repository Structure:** The Git repository is scaffolded with three primary projects:
    -   `server/`: .NET Web API
    -   `client/`: React + TypeScript
    -   `tests/`: xUnit Test Project

### Continuous Integration (CI)
-   [x] **CI Pipeline:** A GitHub Actions workflow is configured to trigger on every pull request to `main`.
-   [x] **Build & Test:** The CI pipeline successfully:
    -   Builds the .NET API.
    -   Builds the React client.
    -   Runs all automated tests in the `tests/` project.
-   [x] **Linting:** The CI pipeline lints the `client/` codebase to enforce code quality standards.
-   [x] **NSwag Client Generation:** The CI pipeline regenerates the TypeScript client from the OpenAPI specification:
    -   Generated client lives in `client/src/api/generated/`
    -   CI fails if regenerated client differs from committed version (prevents contract drift)
    -   NSwag configuration file: `nswag.json` at repository root

### API Configuration
-   [x] **Swagger/OpenAPI:** The .NET API exposes:
    -   Swagger UI at `/swagger`
    -   OpenAPI specification at `/swagger/v1/swagger.json`
-   [x] **Health Endpoint:** A `/health` endpoint returns 200 OK to verify the API is functional.

### Database & Persistence
-   [x] **Database Container:** Docker Compose includes a PostgreSQL 16 service.
-   [x] **Connection String:** API connects via environment variable `ConnectionStrings__Default`.
-   [x] **EF Core Setup:** DataAccess project references EF Core and Npgsql provider.
-   [x] **Initial Migration:** At least one migration exists and applies successfully.

### Local Development & Parity
-   [x] **Containerization:** The entire stack runs via Docker Compose:
    -   `api`: .NET Web API container
    -   `client`: React static build served by nginx
    -   `db`: PostgreSQL 16
    -   `nginx`: Reverse proxy (optional for local dev)
-   [x] **Dockerfiles Committed:** All Dockerfiles and `docker-compose.yml` are tracked in git.
-   [x] **README Documentation:** The root `README.md` provides clear, step-by-step commands for:
    -   Running the API locally: `dotnet run --project server/DeadPigeons.Api`
    -   Running the client locally: `cd client && npm run dev`
    -   Running automated tests: `dotnet test`
    -   Running the entire system: `docker compose up`

### Integration Test Baseline
-   [x] **Testcontainers Setup:** Integration test project uses Testcontainers to spawn PostgreSQL.
-   [x] **Smoke Test:** At least one integration test verifies API starts and responds to health check.

---

## Definition of Ready

The Walking Skeleton is officially **ready** when every checkbox in this document is ticked. At this point, the project has a stable, automated foundation, and the team can confidently proceed with feature development.