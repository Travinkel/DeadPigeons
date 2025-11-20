# Task: Add validation: next week exists

## Description
Add validation to the game-ending logic to ensure that a future, inactive game week exists before attempting to activate it.

## Steps to Complete
1.  In the service method for ending a game, before performing any actions, query the database to find the next sequential game week that is inactive.
2.  If no such game week is found, throw a specific exception (e.g., `NoNextGameWeekException`).
3.  Catch this exception in the controller and return an appropriate error response to the client (e.g., HTTP 409 Conflict with a clear error message).
4.  Add an integration test that scenarios this case: seed only one active game, try to end it, and assert that the operation fails with the expected error.

## Definition of Done
- [ ] Validation is in place to prevent errors when no future game exists.
- [ ] The API returns a meaningful error message.
- [ ] An integration test covers this scenario.
- [ ] CI passes.

## Related User Stories
- US11 — Admin activates next game week
