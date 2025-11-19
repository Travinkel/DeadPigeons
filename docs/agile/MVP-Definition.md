# MVP Definition — Dead Pigeons

This document outlines the requirements for the Minimum Viable Product (MVP). The MVP is considered complete and ready for stakeholder review when all functional and non-functional requirements listed below are met.

The purpose of the MVP is to deliver a version of the system that successfully runs the core loop of the "Dead Pigeons" game, providing immediate value to the Jerne IF administrators and players.

---

## 1. Functional Requirements (Core User Stories)

The MVP must fully implement the following user stories, which represent the critical path for the application.

### EPIC 1: Player & Balance Management

-   **Admin - Player Management:** An administrator must have full CRUD (Create, Read, Update, Delete) capabilities for players, including activating and deactivating them.
-   **Player - Balance Deposits:** A player must be able to signal a deposit by submitting a MobilePay transaction ID.
-   **Admin - Transaction Approval:** An administrator must be able to view and approve pending transactions to update a player's balance.
-   **Player - View Balance:** A player must be able to see their current, approved balance.

### EPIC 2: Core Game Loop

-   **Player - Purchase Boards:** An active player with a positive balance must be able to purchase one or more boards (with 5-8 numbers) for the current active game.
-   **Player - Repeating Boards:** A player must have the option to mark a purchased board to be repeated in subsequent games automatically.
-   **Admin - Conclude Game:** An administrator must be able to end the current game by inputting the three winning numbers. This action should also automatically activate the next game.
-   **Admin - View Game History:** An administrator must be able to see a historical overview of past games, including which boards were played and which were winners.
-   **Admin - Tally Winning Boards:** The system must provide the administrator with a simple count of the total number of *digital* winning boards for any given game.

---

## 2. Non-Functional & Technical Requirements

The MVP must satisfy all mandatory technical requirements as specified in the exam description.

### Systems Development
-   [ ] **CI/CD:** A GitHub Actions workflow is in place that builds, tests, and validates the API and client.
-   [ ] **Testing:**
    -   All API service methods have both "happy path" and "unhappy path" tests.
    -   Tests are implemented using `XUnit.DependencyInjection`.
    -   Integration tests use `TestContainers` for database isolation.

### Programming
-   [ ] **Architecture:** The solution is a distributed application with a React client and a .NET Web API server.
-   [ ] **Client:** The client is built with TypeScript and uses React Router for navigation. No vanilla JavaScript is present in the `src` folder.
-   [ ] **Server:**
    -   The API uses Entity Framework Core for database communication.
    -   All incoming data is validated on the server side.
    -   An OpenAPI/Swagger specification is generated via NSwag.
    -   All entity primary keys use GUIDs.

### CDS Security & Deployment
-   [ ] **Deployment:** The entire system (client and API) is deployed and accessible in a cloud environment.
-   [ ] **Authentication & Authorization:**
    -   The system has distinct user roles (e.g., `Admin`, `Player`).
    -   Users can authenticate to log in.
    -   Passwords are not stored in plaintext and are handled securely.
    -   Authorization policies are implemented to restrict access based on roles (e.g., only Admins can access admin-only functionality).
-   [ ] **Secrets Management:** No secrets (connection strings, API keys, etc.) are present in the Git repository.
-   [ ] **Documentation:**
    -   The root `README.md` is updated with the current state of the project.
    -   Security policies (who can access what) are documented.

---

## Definition of Ready

The MVP is officially **ready** when every single checkbox in this document is ticked. At that point, the project fulfills the core requirements and is ready for a final review before being handed over to the stakeholder.