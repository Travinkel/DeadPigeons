# Task: Update README: security section with OWASP compliance

## Description
Enhance the `SECURITY.md` or `README.md` with a section detailing the project's approach to security, referencing the OWASP Top 10.

## Steps to Complete
1.  Open the target security documentation file.
2.  Add a new section titled "Security and OWASP Top 10".
3.  For each relevant OWASP Top 10 risk (e.g., A01: Broken Access Control, A02: Cryptographic Failures, A03: Injection), briefly describe how the project mitigates it.
    -   Example for A01: "Access control is enforced using .NET's policy-based authorization on all sensitive endpoints."
    -   Example for A02: "Passwords are not stored in plaintext; we use hashing and salting. All traffic is over HTTPS."

## Definition of Done
- [ ] Security documentation is updated with OWASP references.
- [ ] The mitigation strategies are accurately described.

## Related User Stories
- US10 — System passes security quick probe
- US15 — Documentation is complete and exam-ready
