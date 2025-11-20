# US03 — Admin views player boards for current week

## Summary
An administrator can view all boards submitted by a specific player for the current game week.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To see a list of all boards a player has for the current game
- **So that**: I can verify their entries.

### Acceptance Criteria (Gherkin)
- **Given**: I am an authenticated Admin.
- **When**: I request the list of boards for a specific player for the current, active game week.
- **Then**: The system returns a list of all boards belonging to that player for the current week, showing the numbers selected for each.

### Scope Notes
- **System Parts**: API, Database, UI (for admin).
- **Roles**: Admin.
- **Security**: Endpoint must be protected and accessible only by Admins.
- **Constraints**: The query should filter for the currently active game week.

### Evidence Traceability
- **Endpoints**: `GET /api/players/{playerId}/boards?gameWeek=current`
- **ADRs**: `0006-use-postgresql-and-ef-core.md`
- **Integration Tests**: `PlayerEndpointTests` to verify that the correct boards are returned for a player.
