# Task: Add integration test: repeat logic

## Description
Create integration tests to verify the board repeating logic that is triggered when a game week ends.

## Steps to Complete
1.  In the integration test project, create a new test class `GameEndLogicTests`.
2.  Write a test that sets up a player with a balance and a board marked with `isRepeating = true`.
3.  Trigger the `POST /games/{week}/end` endpoint.
4.  Assert that a new board has been created for that player in the newly activated game week.
5.  Assert that the cost of the new board has been correctly deducted from the player's balance.
6.  Write another test to ensure a board is *not* created if the player has an insufficient balance.

## Definition of Done
- [ ] Tests are added and pass.
- [ ] CI passes.
- [ ] No drift in client/API/OpenAPI.

## Related User Stories
- US12 — System repeats boards to future games
