# US09 — Admin logs in via UI

## Summary
An administrator can log in through the web interface to access administrative functions.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To log in through the UI
- **So that**: I can access the admin dashboard and manage the application.

### Acceptance Criteria (Gherkin)
- **Given**: I am on the login page of the client application.
- **When**: I enter my admin credentials and submit the form.
- **Then**: I am redirected to the admin dashboard, and the UI shows admin-only navigation options.

### Scope Notes
- **System Parts**: API, UI, Auth.
- **Roles**: Admin.
- **Security**: The login form submission must be secure. The client application must securely store the authentication token.
- **Constraints**: Requires a functioning login API endpoint and a client-side login form.

### Evidence Traceability
- **Endpoints**: `POST /api/auth/login`
- **UI**: Login component, Admin dashboard component.
- **Integration Tests**: Client-side tests for the login flow and redirection.
