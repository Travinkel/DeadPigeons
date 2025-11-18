# Security Policy

## Password Handling
All passwords are hashed using OWASP-approved algorithms (PBKDF2, bcrypt, or Argon2).

## Authorization Policies
Authorization rules are defined in code using `IAuthorizationHandler` and policy-based authorization.

## Secrets Policy
No secrets are stored in the repository.  
All secrets are injected using:
- GitHub Secrets (CI)
- Environment variables (local)
- Fly.io secrets (production)

## Data Protection
Soft-delete is enabled for all entities. All actions are timestamped.

## Threat Scanning
The CI workflow includes:
- Secret scanning
- README compliance checks
- Swagger presence checks
