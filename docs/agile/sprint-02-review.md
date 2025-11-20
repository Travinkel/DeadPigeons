# Sprint 2 Review — Data Model + Basic Endpoints

**Sprint Goal:** Establish the data persistence layer with all core entities, migrations, and basic CRUD endpoints.

**Sprint Duration:** Sprint 2
**Sprint Status:** In Progress (CI Pending)
**PR:** #3
**Tag:** `v1.2.0-data-model` (pending)

---

## Sprint Backlog Items

| ID | Item | Status | Notes |
|----|------|--------|-------|
| TASK-2.1 | Define Entities | ✅ Done | Player, Transaction, Board, Game |
| TASK-2.2 | EF Core Configurations | ✅ Done | Query filters, indexes, arrays |
| TASK-2.3 | Migrations | ✅ Done | 20251120161739_DataModel |
| TASK-2.4 | Basic Endpoints | ✅ Done | All controllers unprotected |
| TASK-2.5 | Unit Tests | ✅ Done | 30 tests passing |
| TASK-2.6 | Integration Tests | ⏳ Pending | CI workflow being fixed |
| TASK-2.7 | CI Test Reporting | ⏳ Pending | ReportGenerator setup |

---

## Demonstration Summary

The Data Model sprint delivers:

1. **Complete Entity Model**
   - Player with soft delete and IsActive=false default
   - Transaction for balance calculation
   - Board with PostgreSQL array for numbers
   - Game with status transitions

2. **EF Core Infrastructure**
   - Fluent API configurations
   - Global query filter for soft deletes
   - PostgreSQL-specific column types
   - Proper indexes and constraints

3. **Service Layer**
   - CRUD operations for all entities
   - Balance calculation (sum of approved transactions)
   - Soft delete implementation
   - Game completion with winners

4. **API Endpoints**
   - Full REST API for all entities
   - Unprotected (security in Sprint 3)
   - NSwag-compatible for client generation

5. **Test Coverage**
   - 30 unit tests for service layer
   - Integration tests scaffolded for CI

---

## What Was Planned vs Delivered

| Planned | Delivered | Notes |
|---------|-----------|-------|
| 34 story points | ~30 story points | CI pending |
| 6 tasks | 5 complete, 2 pending | Integration tests + reporting |
| All entities | All entities | ✅ |
| All endpoints | All endpoints | ✅ Unprotected |
| CI green | CI in progress | Test reporting issues |

---

## Adaptations Made

1. **Exam Compliance Updates**
   - Player.IsActive defaults to false (exam requirement)
   - Phone field is required (exam requirement)
   - Board pricing documented (5=20, 6=40, 7=80, 8=160 DKK)

2. **Sprint Restructure**
   - Consolidated old agile structure (epics/tasks/userstories)
   - Now using sprint-based epic files only
   - User stories embedded in sprint epics

3. **CI Improvements**
   - Added HTML test report with ReportGenerator
   - Fixed workflow triggers for feature branches
   - Disabled Ryuk for TestContainers in CI

4. **Security Notice**
   - Added warning to README about unprotected endpoints
   - Clear indication that auth comes in Sprint 3

---

## Definition of Done Verification

- [x] Code compiles without errors
- [x] Unit tests pass (30/30)
- [ ] Integration tests pass in CI
- [ ] NSwag client regenerated
- [x] Documentation updated
- [ ] Code reviewed and merged to main
- [ ] Sprint increment tagged

---

## Curriculum Alignment

| Course | Competency | Evidence |
|--------|-----------|----------|
| PROG | Entity Framework Core | EF configurations, migrations |
| PROG | GUIDs for PKs | All entities use Guid |
| SDE2 | Database migrations | DataModel migration |
| SDE2 | Testing infrastructure | Unit + Integration tests |

---

## Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| CI test reporting | Cannot merge PR | Fixing ReportGenerator setup |
| TestContainers Ryuk | Tests fail in CI | Disabled Ryuk |

---

## Action Items for Next Sprint

1. **Immediate:** Get CI green and merge PR #3
2. **Tag:** Release v1.2.0-data-model
3. **Sprint 3:** Start authentication implementation
   - JWT with ASP.NET Core Identity
   - Authorization policies (Admin/Player)
   - Protect all endpoints
   - DataAnnotations validation

---

## Stakeholder Feedback

*To be collected after demo*

---

## Metrics

| Metric | Value |
|--------|-------|
| Story Points Planned | 34 |
| Story Points Completed | ~30 |
| Velocity | 88% |
| Unit Tests | 30 |
| Code Coverage | TBD |
