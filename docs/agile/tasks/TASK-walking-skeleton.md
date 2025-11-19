# Task: Walking Skeleton (D1)

## Description
Establish the minimal end-to-end system that exercises all layers of the Dead Pigeons application: API → DB → client → CI pipeline. This serves as the foundation for all future slices and ensures infrastructure, build, and deployment pipelines function before adding business logic.

This task corresponds to the D1 exam requirement.

## Steps to Complete
1.  **Create repository structure**: `api/`, `client/`, `docs/`, `.github/workflows/`.
2.  **Add minimal API**: Create a `GET /health` endpoint returning `{ status: "ok" }` and enable OpenAPI/Swagger.
3.  **Add minimal EF Core configuration**: Add a `DbContext` and configure the connection string via environment variables.
4.  **Add minimal Client**: Create a React/Vite client that calls the `/health` endpoint and displays the status.
5.  **Add CI workflow**: Configure a GitHub Actions workflow to build the API and client, and run tests.
6.  **Verify local run**: Ensure `dotnet run` and `npm run dev` work correctly and the client can fetch data from the API.
7.  **Commit and push**: Commit the skeleton and ensure the CI pipeline passes.

## Definition of Done
- [ ] API health endpoint returns 200 OK.
- [ ] Client successfully fetches health endpoint.
- [ ] CI builds API and client with no drift.
- [ ] Repo structure is established and stable.
- [ ] Environment variables are not committed.
- [ ] Walking Skeleton documented in `ADR-0001`.
- [ ] `README.md` references the Walking Skeleton.

## Related User Stories
- US5 — System deploys Slice 1 successfully
