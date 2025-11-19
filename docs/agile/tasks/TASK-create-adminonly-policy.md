# Task: Create AdminOnly policy

## Description
Define and register a policy-based authorization policy in the .NET API named "AdminOnly" to simplify protecting admin-only endpoints.

## Steps to Complete
1.  In `Program.cs`, in the `AddAuthorization` service configuration, add a new policy.
2.  Name the policy "AdminOnly".
3.  Configure the policy to require the user to have a claim of type "role" (or your chosen claim type) with the value "Admin".
    ```csharp
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    ```
4.  Apply this policy to an admin-only endpoint using `[Authorize(Policy = "AdminOnly")]` to test it.

## Definition of Done
- [ ] The "AdminOnly" policy is registered and functional.
- [ ] CI passes.
- [ ] The policy is used to protect at least one endpoint.

## Related User Stories
- US08 — System protects state-changing endpoints
