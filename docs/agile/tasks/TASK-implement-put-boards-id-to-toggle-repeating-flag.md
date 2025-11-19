# Task: Implement PUT /boards/{id} to toggle repeating flag

## Description
Create an API endpoint to allow an administrator to toggle the `isRepeating` flag on a player's board.

## Steps to Complete
1.  Create a new method in the `BoardsController` for `PUT /boards/{id}`.
2.  The endpoint should accept a payload to set the repeating status (e.g., `{ "isRepeating": true }`).
3.  Protect the endpoint with an Admin-only authorization policy.
4.  Implement the service logic to find the board by its ID and update its `isRepeating` property.
5.  Return the updated board object.

## Definition of Done
- [ ] Endpoint is created and functional.
- [ ] Endpoint is protected.
- [ ] CI passes.
- [ ] OpenAPI documentation is updated.

## Related User Stories
- US12 — System repeats boards to future games
- US13 — Admin views repeating boards status
