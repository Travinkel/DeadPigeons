# US14 — System hardens logs and monitoring

## Summary
The system provides detailed, structured logs for key activities to ensure traceability and for monitoring purposes.

## Narrative (Gherkin format)
- **As a**: System Administrator/Developer
- **I want**: The system to log important events in a structured format
- **So that**: I can monitor system health, debug issues, and have an audit trail of security-sensitive actions.

### Acceptance Criteria (Gherkin)
- **Given**: A user performs a key action (e.g., logs in, creates a board).
- **When**: The action is processed by the API.
- **Then**: A structured log entry is created, including details like a correlation ID, user ID, the action performed, and the outcome.

### Scope Notes
- **System Parts**: API (logging infrastructure).
- **Roles**: Admin/Developer.
- **Security**: Logs must not contain sensitive information like passwords or tokens. Authorization failures must be logged.
- **Constraints**: Using a library like Serilog is recommended for structured logging in .NET.

### Evidence Traceability
- **Code**: Serilog configuration in `Program.cs`. Logging statements in services and controllers.
- **CI/CD**: Logs should be accessible in the deployed environment.
