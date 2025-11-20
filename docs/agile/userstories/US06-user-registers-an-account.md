# US06 — User registers an account

## Summary
A new user can register for an account in the system.

## Narrative (Gherkin format)
- **As a**: New User
- **I want**: To register for an account
- **So that**: I can log in and participate in the game.

### Acceptance Criteria (Gherkin)
- **Given**: I am an unauthenticated user.
- **When**: I submit a unique username and a strong password.
- **Then**: A new user account is created, and I can use these credentials to log in.

### Scope Notes
- **System Parts**: API, Database, UI.
- **Roles**: User (unauthenticated).
- **Security**: Passwords must be hashed and salted. The registration endpoint should be public.
- **Constraints**: Username must be unique.

### Evidence Traceability
- **Endpoints**: `POST /api/auth/register`
- **ADRs**: `0006-use-postgresql-and-ef-core.md`
- **Integration Tests**: `AuthEndpointTests` to verify user registration and password hashing.
