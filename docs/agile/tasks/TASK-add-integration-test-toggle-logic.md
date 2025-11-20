# Task: Add integration test: toggle logic

## Description
Create integration tests to verify that the `isRepeating` flag on a board can be successfully toggled via the `PUT /boards/{id}` endpoint.

## Steps to Complete
1.  In the integration test project, create a test that first creates a board.
2.  Call the `PUT /boards/{id}` endpoint to set `isRepeating` to `true`.
3.  Assert that the response body shows the updated state and that a subsequent `GET` request for that board confirms the change.
4.  Create another test that toggles the flag from `true` to `false`.
5.  Create a test to ensure a non-Admin user receives a 403 Forbidden error.

## Definition of Done
- [ ] Tests are added and pass.
- [ ] CI passes.
- [ ] No drift in client/API/OpenAPI.

## Related User Stories
- US12 — System repeats boards to future games
