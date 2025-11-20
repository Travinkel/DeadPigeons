# US07 — User logs in with credentials

## Summary
A registered user can log in to the application.

## Narrative (Gherkin format)
- **As a**: Registered User
- **I want**: To log in with my username and password
- **So that**: I can access my account and the application's features.

### Acceptance Criteria (Gherkin)
- **Given**: I am a registered user.
- **When**: I submit my correct username and password.
- **Then**: I am authenticated, and I receive a token (e.g., JWT) to access protected resources.

### Scope Notes
- **System Parts**: API, UI.
- **Roles**: User.
- **Security**: The login process must be secure, using HTTPS. The authentication token must be handled securely on the client-side.
- **Constraints**: The user must be registered.

### Evidence Traceability
- **Endpoints**: `POST /api/auth/login`
- **Integration Tests**: `AuthEndpointTests` to verify login with correct and incorrect credentials.
