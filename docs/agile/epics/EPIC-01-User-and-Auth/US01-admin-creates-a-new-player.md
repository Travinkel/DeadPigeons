# US01 — Admin creates a new player

## Summary
An administrator can register a new player in the system with their contact details.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To create a new player account with a name, phone number, and email
- **So that**: They can be registered in the system to participate in the game.

### Acceptance Criteria (Gherkin)
- **Given**: I am an authenticated Admin.
- **When**: I submit a new player's full name, phone number, and email address via the API.
- **Then**: A new player entity is created in the database with a unique ID and an `inactive` status by default.

### Scope Notes
- **System Parts**: API, Database.
- **Roles**: Admin.
- **Security**: The endpoint for creating a player must be protected and only accessible by users with the 'Admin' role. Player data (PII) must be handled in accordance with security best practices.
- **Constraints**: A player is `inactive` upon creation and must be activated by an Admin separately.

### Evidence Traceability
- **Endpoints**: `POST /api/players`
- **ADRs**: `0006-use-postgresql-and-ef-core.md`
- **Integration Tests**: `PlayerEndpointTests` should include tests for creating a player, verifying default status, and checking for required fields.
