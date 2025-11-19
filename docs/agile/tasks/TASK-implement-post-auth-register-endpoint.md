# Task: Implement POST /auth/register endpoint

## Description
Create the public API endpoint that allows a new user to register for an account.

## Steps to Complete
1.  Create a new `AuthController` if one doesn't exist.
2.  Add a method for `POST /auth/register`. This endpoint should be public (`[AllowAnonymous]`).
3.  The method should accept a DTO with registration details (e.g., username, password).
4.  Implement the service logic to:
    -   Validate that the username is not already taken.
    -   Hash and salt the password using a secure algorithm (e.g., BCrypt).
    -   Create the new user entity in the database.
5.  Return a success response (e.g., HTTP 201 Created).

## Definition of Done
- [ ] Endpoint is created and functional.
- [ ] User passwords are securely hashed.
- [ ] Username uniqueness is enforced.
- [ ] CI passes.
- [ ] OpenAPI documentation is updated.

## Related User Stories
- US06 — User registers an account
