# US12 — System repeats boards to future games

## Summary
The system automatically carries over boards marked for repetition into the new game week.

## Narrative (Gherkin format)
- **As a**: System
- **I want**: To automatically create copies of repeating boards for the new game week
- **So that**: Players don't have to manually re-enter their recurring boards.

### Acceptance Criteria (Gherkin)
- **Given**: A player has a board marked as `repeating`.
- **When**: An Admin ends the current game, activating the next one.
- **Then**: A new copy of the repeating board is created and associated with the newly activated game week and the player. The cost is deducted from the player's balance.

### Scope Notes
- **System Parts**: API (business logic), Database.
- **Roles**: System/Admin (trigger).
- **Security**: The logic must ensure that the player has sufficient balance for the repeated board.
- **Constraints**: This logic is part of the transaction when a game week is ended.

### Evidence Traceability
- **Endpoints**: `POST /api/games/{week}/end` (triggers the logic)
- **Integration Tests**: `GameEndpointTests` must include scenarios for repeating boards, including cases with insufficient balance.
