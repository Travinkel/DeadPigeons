# US04 — Admin views boards list in UI

## Summary
An administrator can see a comprehensive list of all boards for the current game in the user interface.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To view a list of all boards in the current game, sortable and filterable by player
- **So that**: I can get a complete overview of all digital participants.

### Acceptance Criteria (Gherkin)
- **Given**: I am logged into the client application as an Admin.
- **When**: I navigate to the "Boards" overview page.
- **Then**: I see a table displaying all boards for the current game, with columns for player name, the numbers on the board, and the board's purchase price.

### Scope Notes
- **System Parts**: API, UI, Database.
- **Roles**: Admin.
- **Security**: The client-side route and the backing API endpoint must be protected for Admin access only.
- **Constraints**: The UI should handle pagination for large numbers of boards.

### Evidence Traceability
- **Endpoints**: `GET /api/boards?gameWeek=current`
- **ADRs**: `0002-client-folder-structure-and-ci-linting.md`
- **Integration Tests**: API tests for the board list endpoint. Client-side component tests for the board list view.
