# US08 — System protects state-changing endpoints

## Summary
The system ensures that only authorized users can modify data.

## Narrative (Gherkin format)
- **As a**: System
- **I want**: To protect all endpoints that create, update, or delete data
- **So that**: Only authenticated and authorized users can make changes.

### Acceptance Criteria (Gherkin)
- **Given**: An endpoint that modifies data (e.g., `POST /api/players`).
- **When**: An unauthenticated user attempts to access it.
- **Then**: The request is rejected with a 401 Unauthorized status.
- **Given**: An endpoint that requires Admin privileges.
- **When**: An authenticated non-Admin user attempts to access it.
- **Then**: The request is rejected with a 403 Forbidden status.

### Scope Notes
- **System Parts**: API (middleware, authorization policies).
- **Roles**: All.
- **Security**: This is a fundamental security requirement. Role-based access control (RBAC) should be implemented.
- **Constraints**: All state-changing endpoints must have an authorization policy.

### Evidence Traceability
- **ADRs**: `0005-containerization-and-distributed-runtime.md`
- **Code**: Authorization attributes on API controllers/endpoints.
