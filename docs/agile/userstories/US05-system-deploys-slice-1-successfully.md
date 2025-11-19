# US05 — System deploys Slice 1 successfully

## Summary
The application's first vertical slice can be successfully built, tested, and deployed to a cloud environment.

## Narrative (Gherkin format)
- **As a**: Developer
- **I want**: The CI/CD pipeline to automatically build, test, and deploy the application
- **So that**: We can ensure a stable and repeatable deployment process.

### Acceptance Criteria (Gherkin)
- **Given**: A code change is pushed to the main branch.
- **When**: The GitHub Actions workflow is triggered.
- **Then**: The API and client are built, tests are run, and the application is deployed to the cloud provider, making the health check endpoint publicly accessible.

### Scope Notes
- **System Parts**: CI/CD pipeline (GitHub Actions), API, Client, Cloud hosting environment.
- **Roles**: Developer.
- **Security**: Deployment secrets (API keys, connection strings) must be managed securely and not exposed in the repository.
- **Constraints**: The deployment must include both the .NET API and the React client.

### Evidence Traceability
- **Endpoints**: `GET /health`
- **ADRs**: `0001-walking-skeleton-and-project-structure.md`, `0004-walking-skeleton-uses-docker-for-parity.md`, `0005-containerization-and-distributed-runtime.md`
- **CI/CD**: `.github/workflows/ci.yml`
