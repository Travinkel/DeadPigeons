# Task: Configure JWT or session-based auth

## Description
Configure the authentication scheme for the .NET API, using either JWT (JSON Web Tokens) or a session-based mechanism.

## Steps to Complete
1.  Decide on the authentication mechanism (JWT is common for stateless APIs).
2.  Add the necessary NuGet package (e.g., `Microsoft.AspNetCore.Authentication.JwtBearer`).
3.  In `Program.cs`, configure the authentication services.
4.  For JWT, this involves specifying the token validation parameters (issuer, audience, and the secret key). The secret key must be loaded securely from configuration and not hardcoded.
5.  Add the authentication middleware to the request pipeline (`app.UseAuthentication()`).
6.  Create a service to generate tokens for users upon successful login.

## Definition of Done
- [ ] Authentication services are configured.
- [ ] The API can validate tokens and populate the `User.Identity`.
- [ ] Secrets are handled securely.
- [ ] CI passes.

## Related User Stories
- US07 — User logs in with credentials
- US08 — System protects state-changing endpoints
