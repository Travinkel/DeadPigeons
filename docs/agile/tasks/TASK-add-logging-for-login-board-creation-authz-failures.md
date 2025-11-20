# Task: Add logging for login, board creation, authz failures

## Description
Implement specific log entries for critical security and business events: user login, board creation, and authorization failures.

## Steps to Complete
1.  **Login**: In the `POST /auth/login` endpoint logic, add a log entry upon successful login, recording the `UserId` and a timestamp.
2.  **Board Creation**: In the service that creates a board, log the `PlayerId`, the new `BoardId`, and the cost.
3.  **Authorization Failures**: Create a custom authorization middleware or filter that catches authorization failures (403 Forbidden results). Log the `UserId` (if available), the requested path, and the policy that failed.

## Definition of Done
- [ ] Key events are logged in a structured format.
- [ ] Logs include relevant, non-sensitive context information.
- [ ] CI passes.

## Related User Stories
- US14 — System hardens logs and monitoring
