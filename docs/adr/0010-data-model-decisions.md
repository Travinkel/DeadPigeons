# ADR-0010: Data Model Design Decisions

## Status
Accepted

## Date
2025-11-20

## Context

The Dead Pigeons application requires a data model that supports:
- Player management with balance tracking
- Board purchasing with number selection
- Game management with weekly draws
- Transaction history for auditing

Key decisions need to be made regarding:
- Balance storage vs calculation
- Soft deletes vs hard deletes
- Array storage for numbers
- Primary key strategy

## Decisions

### 1. Calculated Balance (No Balance Column)

**Decision:** Player balance is calculated from transaction history, not stored as a column.

**Rationale:**
- **Audit trail:** All balance changes are traceable
- **Consistency:** No risk of balance column drifting from actual transactions
- **Compliance:** Financial regulations often require full transaction history
- **Debugging:** Easy to reconstruct balance at any point in time

**Trade-off:**
- Slightly slower balance queries (mitigated by indexing)
- Balance calculation: `SUM(Amount) WHERE IsApproved = true`

### 2. Soft Deletes for Players Only

**Decision:** Use soft deletes (DeletedAt timestamp) only for Player entity.

**Rationale:**
- **Player history:** Preserve boards and transactions linked to deleted players
- **Audit requirements:** Cannot lose player data for compliance
- **Other entities:** Boards, Transactions, Games are append-only or immutable

**Implementation:**
```csharp
public DateTime? DeletedAt { get; set; }

// Global query filter
modelBuilder.Entity<Player>()
    .HasQueryFilter(p => p.DeletedAt == null);
```

### 3. PostgreSQL Arrays for Numbers

**Decision:** Store board and winning numbers as PostgreSQL integer arrays.

**Rationale:**
- **Native support:** PostgreSQL has excellent array support
- **Query efficiency:** Can use `@>` (contains) operator for winner detection
- **Simplicity:** No separate junction table needed
- **EF Core support:** Npgsql provider handles array mapping

**Trade-off:**
- PostgreSQL-specific feature (acceptable for this project)
- Cannot use SQL Server or SQLite without modification

**Validation:**
- Array length: 5-8 for boards, exactly 3 for winning numbers
- Enforced at application and database level

### 4. GUIDs for Primary Keys

**Decision:** Use GUIDs (Guid type) for all primary keys.

**Rationale:**
- **Exam requirement:** Explicitly required in project specification
- **Distributed safety:** No coordination needed for ID generation
- **Security:** Non-sequential IDs prevent enumeration attacks
- **Merge safety:** No conflicts when combining databases

**Trade-off:**
- Larger storage than integers (16 bytes vs 4 bytes)
- Slightly slower joins (acceptable for this scale)

### 5. Player Default State

**Decision:** Players are **inactive by default** and must be activated by admin.

**Rationale:**
- **Exam requirement:** Explicitly stated in project specification
- **Security:** Prevents unauthorized access until admin approval
- **Business rule:** Admin controls who can participate

**Implementation:**
```csharp
public bool IsActive { get; set; } = false;  // Default inactive
```

### 6. Required Registration Fields

**Decision:** Phone is **required** for player registration.

**Rationale:**
- **Exam requirement:** "Full name, phone, and email" specified
- **Contact:** Enables admin to contact players
- **Identity:** Additional verification factor

**Implementation:**
```csharp
public string Phone { get; set; } = string.Empty;  // Required, max 20
```

### 7. Board Pricing Model

**Decision:** Progressive pricing based on number count.

| Numbers | Price |
|---------|-------|
| 5 | 20 DKK |
| 6 | 40 DKK |
| 7 | 80 DKK |
| 8 | 160 DKK |

**Rationale:**
- **Exam requirement:** Specific pricing in project specification
- **Progressive risk:** More numbers = higher investment = higher chance

### 8. Saturday 5 PM Cutoff

**Decision:** Board purchases close Saturday at 5 PM.

**Rationale:**
- **Exam requirement:** Specified deadline
- **Draw timing:** Allows time for draw processing
- **Fairness:** Clear deadline for all players

### 9. Prize Distribution

**Decision:** 70% to prize pool, 30% to Jerne IF facility management.

**Rationale:**
- **Exam requirement:** Explicitly stated split
- **Sustainability:** Ensures ongoing facility support

### 10. Transaction-Per-Board Purchase Model

**Decision:** Each board purchase creates one transaction.

**Rationale:**
- **Atomicity:** Purchase either succeeds or fails completely
- **Traceability:** Clear link from board to its purchase
- **Refunds:** Can refund specific board purchases

**Implementation:**
- Board has FK to Transaction
- Transaction amount calculated from pricing model

### 11. Single Active Game Constraint

**Decision:** Only one game can be Active at any time.

**Rationale:**
- **Business rule:** Weekly game, no overlapping
- **Simplicity:** Clear which game receives new boards
- **User experience:** No confusion about current game

**Enforcement:**
- Application layer check before creating/activating game
- Not enforced at database level (would require trigger)

### 12. Winning Board Definition

**Decision:** A board wins if it contains ALL three winning numbers.

**Rationale:**
- **Game rules:** Standard definition from project requirements
- **Query:** `winningNumbers.All(n => board.Numbers.Contains(n))`
- **No partial wins:** Simplifies payout logic

## Consequences

### Positive
- Strong audit trail for all financial operations
- Efficient queries using PostgreSQL array operators
- Clear separation between mutable (Player) and immutable (Transaction) data
- Exam requirements met (GUIDs, proper architecture)

### Negative
- Balance calculation requires aggregation query
- PostgreSQL-specific array feature limits portability
- Soft delete requires global query filters to avoid bugs

### Mitigations
- Index on (PlayerId, IsApproved) for fast balance queries
- Document PostgreSQL dependency in README
- Comprehensive tests for soft delete behavior

## Alternatives Considered

### Balance Column Instead of Calculation
- **Rejected:** Risk of inconsistency, harder to audit

### Separate Numbers Table (Junction)
- **Rejected:** Overly complex, slower queries

### Integer Auto-Increment IDs
- **Rejected:** Exam requires GUIDs

### Multiple Simultaneous Games
- **Rejected:** Not required by business rules

## Curriculum Alignment

- **Programming II:** EF Core, repository pattern, LINQ
- **SDE2:** Data modeling, migrations, testing
- **CDS.Security:** Audit trails, soft deletes

## Related Documentation

- [Data Model Reference](../reference/data-model.md)
- [Sprint 3 Epic](../agile/sprint-03-epic.md)
- [ADR-0001: Walking Skeleton](0001-walking-skeleton-and-project-structure.md)
