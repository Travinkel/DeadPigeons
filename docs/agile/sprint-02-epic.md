# Sprint 2 EPIC — Data Model + Basic Endpoints

**Epic ID:** EPIC-02
**Sprint:** 2
**Branch:** `feature/data-model`
**Status:** Complete

---

## Epic Summary

Design and implement the core data model for Dead Pigeons. This sprint establishes the persistence layer with EF Core entities, migrations, and basic CRUD endpoints. **Endpoints are unprotected** — security is added in Sprint 3.

## Why This Sprint Order?

The data model comes **before** authentication because:
1. Entities must exist before we can secure them
2. Database schema must be stable before adding user identity
3. Basic endpoints allow testing the data layer independently

Security is added in Sprint 3 to ensure all exam CDS.Security requirements are met.

---

## Exam Competencies

| Course | Competencies |
|--------|-------------|
| PROG | Entity Framework Core, GUIDs, server-side validation |
| SDE2 | Database migrations, testing infrastructure |

---

## Acceptance Criteria

- [x] All core entities defined with proper relationships
- [x] EF Core configurations complete
- [x] Migrations created and tested
- [x] Basic CRUD endpoints operational (unprotected)
- [x] Unit tests for domain logic (30 passing)
- [x] Integration tests pass in CI with TestContainers
- [x] NSwag client regenerated

---

## User Stories

| Story ID | User Story | Acceptance Criteria |
|----------|------------|---------------------|
| US-2.1 | As a developer, I need Player entity so I can manage users | CRUD operations work, soft delete implemented |
| US-2.2 | As a developer, I need Transaction entity so balance can be tracked | Sum of approved transactions = balance |
| US-2.3 | As a developer, I need Board entity so games can be played | 5-8 numbers stored as PostgreSQL array |
| US-2.4 | As a developer, I need Game entity so draws can be conducted | Status transitions work, winning numbers stored |
| US-2.5 | As a developer, I need migrations so schema is versioned | Migrations apply cleanly |

---

## Tasks

### TASK-2.1: Define Entities (8 SP)

**Entities:**
- Player (with **IsActive = false** default)
- Transaction (with type enum)
- Board (with PostgreSQL array)
- Game (with status enum)

**Key Requirements per Exam:**
- Phone is **required** (not optional)
- Players **inactive by default**
- GUIDs for all primary keys

### TASK-2.2: EF Core Configurations (5 SP)

- Fluent API configurations
- Indexes (Email unique, PlayerId, IsApproved)
- Soft delete query filter for Player
- PostgreSQL array column types

### TASK-2.3: Migrations (3 SP)

- Initial migration with all entities
- Apply and test rollback
- CI runs migrations in tests

### TASK-2.4: Basic Endpoints (8 SP)

**Endpoints (unprotected):**
- Players: GET, POST, PUT, DELETE, GET balance
- Transactions: GET pending, POST deposit, POST approve
- Boards: GET, POST
- Games: GET, POST, POST complete

**Note:** Endpoints unprotected in this sprint. Security added in Sprint 3.

### TASK-2.5: Unit Tests (5 SP)

- Balance calculation (sum of approved)
- Soft delete behavior
- Number validation (5-8)
- Game state transitions

### TASK-2.6: Integration Tests (5 SP)

- CRUD operations with TestContainers
- CI-only (Shadow PC limitation)
- Migration testing

**Total Story Points:** 34

---

## Data Model Summary

### Player Entity
```
Id: Guid (PK)
Name: string (required, max 100)
Email: string (required, unique)
Phone: string (required, max 20)     ← REQUIRED per exam
IsActive: bool (default: false)       ← INACTIVE per exam
CreatedAt, UpdatedAt, DeletedAt
```

### Board Pricing (implemented in Sprint 4)
- 5 numbers = 20 DKK
- 6 numbers = 40 DKK
- 7 numbers = 80 DKK
- 8 numbers = 160 DKK

### Key Decisions (ADR-0010)
- Calculated balance (no balance column)
- Soft delete for Player only
- PostgreSQL arrays for numbers
- Single active game constraint

---

## Definition of Done

- [x] Entities created with correct defaults
- [x] Configurations apply all constraints
- [x] Migrations tested (CI + local if possible)
- [x] Endpoints operational (unprotected)
- [x] Unit tests pass locally (30/30)
- [x] Integration tests pass in CI
- [x] Documentation updated
- [x] CI with GitHub Actions test logger showing annotations
- [x] PR reviewed and merged

---

## Related Documentation

- [Data Model Reference](../reference/data-model.md)
- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)
- [Roadmap](roadmap.md)
- [Sprint 1 Review](sprint-01-review.md)
