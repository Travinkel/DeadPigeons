# US02 — Admin creates board for active player

## Summary
An administrator can create a new game board for an active player.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To create a new board with 5-8 numbers for an active player
- **So that**: The player can participate in the current game week.

### Acceptance Criteria (Gherkin)
- **Given**: I am an authenticated Admin and there is an `active` player in the system.
- **When**: I submit a request to create a board for the player with a selection of 5 to 8 numbers between 1 and 16.
- **Then**: A new board entity is created and associated with the player and the current active game. The board's cost is deducted from the player's balance.

### Scope Notes
- **System Parts**: API, Database, UI (for admin).
- **Roles**: Admin.
- **Security**: Endpoint must be protected and accessible only by Admins. Validation must ensure the player is active and has sufficient balance.
- **Constraints**: The player must be active. The number of selections must be between 5 and 8. The board cost depends on the number of selected numbers.

### Evidence Traceability
- **Endpoints**: `POST /api/players/{playerId}/boards`
- **ADRs**: `0006-use-postgresql-and-ef-core.md`
- **Integration Tests**: `BoardEndpointTests` to verify board creation, balance deduction, and validation rules.
