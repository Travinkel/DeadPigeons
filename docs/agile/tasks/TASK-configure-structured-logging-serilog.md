# Task: Configure structured logging (Serilog)

## Description
Integrate Serilog into the .NET API to provide structured, filterable, and easily searchable logs. This is crucial for monitoring, debugging, and meeting security requirements for audit trails.

## Steps to Complete
1.  Add `Serilog.AspNetCore` and relevant sinks (e.g., `Serilog.Sinks.Console`, `Serilog.Sinks.File`) to `DeadPigeons.Api.csproj`.
2.  Configure Serilog in `Program.cs`, reading configuration from `appsettings.json`.
3.  Enrich logs with properties like `CorrelationId`, `UserId`, and `Endpoint`.
4.  Replace `ILogger` instances with Serilog's logger where applicable.
5.  Ensure logs are written to the console during development and to a file in production environments.

## Definition of Done
- [ ] API logs are generated in a structured JSON format.
- [ ] CI passes.
- [ ] Documentation updated in `README.md` explaining the logging setup.
- [ ] No drift in client/API/OpenAPI.
- [ ] Security checks if relevant (sensitive data is not logged).

## Related User Stories
- US14 — System hardens logs and monitoring
