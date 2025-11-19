# US13 — Admin views repeating boards status

## Summary
An administrator can see which boards are set to repeat.

## Narrative (Gherkin format)
- **As an**: Admin
- **I want**: To see an indicator for boards that are marked as repeating
- **So that**: I can easily identify which boards will carry over to the next game.

### Acceptance Criteria (Gherkin)
- **Given**: I am viewing the list of boards in the UI.
- **When**: A board is marked as repeating.
- **Then**: The UI displays a visual indicator (e.g., an icon or a tag) next to that board.

### Scope Notes
- **System Parts**: API, UI.
- **Roles**: Admin.
- **Security**: N/A for this read-only feature.
- **Constraints**: The API response for boards must include the `isRepeating` flag.

### Evidence Traceability
- **Endpoints**: `GET /api/boards`
- **UI**: Board list component.
