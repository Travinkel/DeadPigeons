# Task: Update README: test instructions with TestContainers

## Description
Update the `README.md` to include clear instructions on how to run the integration tests, specifically mentioning the TestContainers dependency.

## Steps to Complete
1.  Open `README.md`.
2.  Create a "Running Tests" section.
3.  Explain that integration tests require Docker to be running because they use TestContainers to spin up an isolated PostgreSQL database for each test run.
4.  Provide the command to run the tests (e.g., `dotnet test`).
5.  Mention that this ensures tests are reliable and don't depend on a local database setup.

## Definition of Done
- [ ] `README.md` contains clear instructions for running tests.
- [ ] The dependency on Docker and TestContainers is explicitly stated.

## Related User Stories
- US15 — Documentation is complete and exam-ready
