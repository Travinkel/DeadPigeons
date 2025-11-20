# Task: Add integration test: activation logic

## Description
Create integration tests for the game activation logic to ensure it behaves as expected under various conditions.

## Steps to Complete
1.  Create a test that successfully ends a game and activates the next one.
2.  Assert that the old game is marked as finished and has winning numbers.
3.  Assert that the new game is marked as active.
4.  Create a test that attempts to end a game that is not active and assert that it fails with an appropriate error.
5.  Create a test that attempts to end a game when no next game is available and assert that it fails gracefully.

## Definition of Done
- [ ] Tests are added and pass.
- [ ] CI passes.
- [ ] No drift in client/API/OpenAPI.

## Related User Stories
- US11 — Admin activates next game week
