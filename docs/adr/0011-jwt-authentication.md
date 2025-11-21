# ADR-0011: JWT Authentication

## Status
Accepted

## Context
The Dead Pigeons application requires authentication to secure API endpoints. We need to choose an authentication mechanism that:
- Is stateless (no server-side session storage)
- Works well with SPA clients
- Supports role-based authorization
- Meets CDS.Security exam requirements

## Decision
We will use JWT (JSON Web Tokens) with the following configuration:

### Token Structure
- **Algorithm:** HMAC-SHA256
- **Claims:** sub (user ID), email, role, jti (token ID)
- **Expiration:** Configurable (default 60 minutes)

### Password Hashing
- **Library:** ASP.NET Core Identity PasswordHasher
- **Algorithm:** PBKDF2 with HMAC-SHA256
- **Salt:** Automatic per-password salt

### Authorization Policies
- **RequireAdmin:** Admin role only
- **RequirePlayer:** Player or Admin role
- **RequireAuthenticated:** Any authenticated user

## Consequences

### Positive
- Stateless authentication scales horizontally
- Token contains all necessary claims
- Works with any client (web, mobile, API)
- Secure password storage with industry-standard hashing

### Negative
- Token cannot be invalidated before expiry (without additional infrastructure)
- Secret key must be protected
- Larger payload than session cookie

### Risks Mitigated
- Replay attacks: Short expiration, HTTPS only
- Token theft: HttpOnly cookies (if used), secure transmission
- Password exposure: PBKDF2 with salt

## Security Considerations

### Environment Variables
- `Jwt__Secret`: Signing key (min 32 chars)
- `Jwt__Issuer`: Token issuer
- `Jwt__Audience`: Token audience
- `Jwt__ExpirationMinutes`: Token lifetime

### Never in Git
- JWT secrets
- Database passwords
- Any credentials

## Related
- [ADR-0010: Data Model Decisions](0010-data-model-decisions.md)
- [Sprint 3 Epic](../agile/sprint-03-epic.md)
- [Network Architecture](../explanation/networking.md)
