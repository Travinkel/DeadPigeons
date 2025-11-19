# US11 — Admin activates next game week

## Summary
An administrator can end the current game week, which automatically activates the next one.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To end the current game by entering the winning numbers
- **So that**: The next game week becomes active for players.

### Acceptance Criteria (Gherkin)
- **Given**: I am an authenticated Admin, and there is an active game week.
- **When**: I submit the 3 winning numbers for the current game.
- **Then**: The current game is marked as finished, the winning numbers are saved, and the next sequential game week is marked as active.

### Scope Notes
- **System Parts**: API, Database.
- **Roles**: Admin.
- **Security**: This is a critical, state-changing operation that must be restricted to Admins. The operation should be transactional.
- **Constraints**: A next game week must exist in the database to be activated.

### Evidence Traceability
- **Endpoints**: `POST /api/games/{week}/end`
- **ADRs**: `0006-use-postgresql-and-ef-core.md`
- **Integration Tests**: `GameEndpointTests` to verify the game-ending logic and the activation of the next game.
