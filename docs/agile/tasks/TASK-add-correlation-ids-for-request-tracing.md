# Task: Add correlation IDs for request tracing

## Description
Implement correlation IDs to trace a single request as it flows through the API and its various services, making debugging and monitoring much easier.

## Steps to Complete
1.  Add a simple middleware to the API pipeline.
2.  In the middleware, check for an incoming `X-Correlation-ID` header. If it exists, use it. If not, generate a new GUID.
3.  Add the correlation ID to the `HttpContext.TraceIdentifier`.
4.  Add the correlation ID to the Serilog logging context so that every log message produced during that request is enriched with it.
5.  Configure the middleware to add the correlation ID to the response headers, so the client can also use it for logging.

## Definition of Done
- [ ] Every API request has a unique correlation ID.
- [ ] All log entries for a given request share the same correlation ID.
- [ ] The correlation ID is returned in the API response headers.
- [ ] CI passes.

## Related User Stories
- US14 — System hardens logs and monitoring
