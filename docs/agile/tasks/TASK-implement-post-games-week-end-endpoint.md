# Task: Implement POST /games/{week}/end endpoint

## Description
Create the API endpoint that allows an administrator to end the current game week by submitting the winning numbers.

## Steps to Complete
1.  Create a new method in the `GamesController` for `POST /games/{week}/end`.
2.  The endpoint should accept a payload containing the 3 winning numbers.
3.  Add an `[Authorize(Policy = "AdminOnly")]` attribute to protect the endpoint.
4.  Implement the corresponding service method that contains the business logic for ending the game, saving winning numbers, and activating the next game.
5.  Ensure validation is in place (e.g., exactly 3 numbers are provided).

## Definition of Done
- [ ] Endpoint is created and functional.
- [ ] Endpoint is protected and only accessible by Admins.
- [ ] CI passes.
- [ ] OpenAPI/Swagger documentation is updated.

## Related User Stories
- US11 — Admin activates next game week
