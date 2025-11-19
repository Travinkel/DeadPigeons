# Walking Skeleton Definition — Dead Pigeons

This document outlines the requirements for the Walking Skeleton. The Walking Skeleton is considered complete when all technical and infrastructure tasks listed below are successfully implemented and automated.

The purpose of the Walking Skeleton is to establish a solid technical foundation for the project. It ensures that the core infrastructure, continuous integration, and deployment pipelines are in place before any significant feature development begins. This de-risks the development process by front-loading critical technical decisions and integrations.

---

## 1. Technical Requirements & Infrastructure Gates

The Walking Skeleton is defined by the following technical capabilities and infrastructure setup. There are no domain-specific features in the Walking Skeleton; it is purely a technical slice.

### Source Control & Repository
-   [ ] **Repository Structure:** The Git repository is scaffolded with three primary projects:
    -   `server/`: .NET Web API
    -   `client/`: React + TypeScript
    -   `tests/`: xUnit Test Project

### Continuous Integration (CI)
-   [ ] **CI Pipeline:** A GitHub Actions workflow is configured to trigger on every pull request to `main`.
-   [ ] **Build & Test:** The CI pipeline successfully:
    -   Builds the .NET API.
    -   Builds the React client.
    -   Runs all automated tests in the `tests/` project.
-   [ ] **Linting:** The CI pipeline lints the `client/` codebase to enforce code quality standards.
-   [ ] **NSwag Client Generation:** The CI pipeline automatically regenerates the TypeScript client for the API based on the latest OpenAPI specification.

### API Configuration
-   [ ] **Swagger/OpenAPI:** The .NET API exposes a Swagger UI and an `openapi.json` specification.
-   [ ] **Endpoint:** At least one "hello world" endpoint is present to verify the API is functional.

### Local Development & Parity
-   [ ] **Containerization:** The entire application (API and client) can be run locally using Docker Compose. This ensures development, testing, and production environments are as similar as possible ("parity").
-   [ ] **README Documentation:** The root `README.md` provides clear, step-by-step instructions for:
    -   Running the API locally.
    -   Running the client locally.
    -   Running the automated tests.
    -   Running the entire system using Docker.

---

## Definition of Ready

The Walking Skeleton is officially **ready** when every checkbox in this document is ticked. At this point, the project has a stable, automated foundation, and the team can confidently proceed with feature development.