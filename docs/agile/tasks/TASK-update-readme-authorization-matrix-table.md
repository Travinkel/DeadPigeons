# Task: Update README: authorization matrix table

## Description
Add a clear authorization matrix to the `README.md` or `SECURITY.md` to document who can access what.

## Steps to Complete
1.  Open the documentation file.
2.  Create a new section "Authorization Policy".
3.  Create a Markdown table with columns: "Role", "Resource/Endpoint", "Allowed Actions (CRUD)".
4.  Fill out the table for both `Admin` and `User` roles.
    -   Example Row 1: `Admin` | `/api/players` | `Create, Read, Update, Delete`
    -   Example Row 2: `User` | `/api/boards` | `Read (own only)`

## Definition of Done
- [ ] Authorization matrix is added to the documentation.
- [ ] The matrix accurately reflects the implemented authorization policies.

## Related User Stories
- US08 — System protects state-changing endpoints
- US15 — Documentation is complete and exam-ready
