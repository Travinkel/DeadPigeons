# Task: Add transactional boundary for game activation

## Description
Ensure that the process of ending a game and activating the next one is performed within a single atomic database transaction to prevent data inconsistencies.

## Steps to Complete
1.  Identify the service method responsible for ending a game.
2.  Wrap the logic (updating current game, activating next game, copying repeating boards) in a `DbContext` transaction.
3.  Use `await _context.Database.BeginTransactionAsync()` and `await transaction.CommitAsync()`.
4.  Implement a `try-catch` block to roll back the transaction (`await transaction.RollbackAsync()`) if any part of the process fails.
5.  Add an integration test that attempts to trigger a failure (e.g., by having a repeating board for a user with no balance) and asserts that the entire operation is rolled back (i.e., the next game is not activated).

## Definition of Done
- [ ] The game activation logic is transactional.
- [ ] Tests are added to verify atomicity.
- [ ] CI passes.

## Related User Stories
- US11 — Admin activates next game week
- US12 — System repeats boards to future games
