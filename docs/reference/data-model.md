# Data Model Reference - Dead Pigeons

## Overview

The Dead Pigeons data model supports a weekly lottery-style game where players purchase boards with numbers and administrators conduct draws to determine winners.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   Player    │1─────*│   Transaction   │       │    Game     │
└─────────────┘       └─────────────────┘       └─────────────┘
       │1                      │1                      │1
       │                       │                       │
       │*                      │1                      │*
┌─────────────┐                │                ┌─────────────┐
│   Board     │*───────────────┘                │   Board     │
└─────────────┘                                 └─────────────┘
```

## Entities

### Player

Represents a participant in the Dead Pigeons game.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | Guid | PK | Unique identifier |
| Name | string | Required, max 100 | Player's full name |
| Email | string | Required, unique, max 255 | Contact email |
| Phone | string | **Required**, max 20 | Contact phone (exam requirement) |
| IsActive | bool | **Default false** | Admin must activate (exam requirement) |
| CreatedAt | DateTime | Required | Record creation timestamp |
| UpdatedAt | DateTime | Required | Last modification timestamp |
| DeletedAt | DateTime | Nullable | Soft delete timestamp |

**Indexes:**
- Unique index on Email
- Index on IsActive for filtering

**Business Rules:**
- Email must be unique across all players (including soft-deleted)
- Inactive players cannot purchase boards
- Balance is calculated from transaction history, not stored

---

### Transaction

Tracks all financial movements for balance calculation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | Guid | PK | Unique identifier |
| PlayerId | Guid | FK, required | Reference to Player |
| Amount | decimal(18,2) | Required | Transaction amount |
| Type | TransactionType | Required | Deposit, Purchase, or Refund |
| MobilePayTransactionId | string | Optional, max 50 | External payment reference |
| IsApproved | bool | Default false | Admin approval status |
| CreatedAt | DateTime | Required | Transaction timestamp |
| ApprovedAt | DateTime | Nullable | Approval timestamp |
| ApprovedById | Guid | Nullable | Admin who approved |

**TransactionType Enum:**
- Deposit (positive amount)
- Purchase (negative amount)
- Refund (positive amount)

**Indexes:**
- Index on PlayerId for balance queries
- Index on IsApproved for pending queue

**Business Rules:**
- Only approved transactions count toward balance
- Balance = SUM(Amount) WHERE IsApproved = true
- Purchases automatically approved (linked to board creation)

---

### Board

Represents a purchased board for a specific game.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | Guid | PK | Unique identifier |
| PlayerId | Guid | FK, required | Board owner |
| GameId | Guid | FK, required | Game participation |
| Numbers | int[] | Required, 5-8 elements | Selected numbers |
| IsRepeating | bool | Default false | Auto-repeat in next game |
| CreatedAt | DateTime | Required | Purchase timestamp |
| TransactionId | Guid | FK, required | Purchase transaction |

**Indexes:**
- Index on PlayerId for player's boards
- Index on GameId for game results
- Composite index on (GameId, Numbers) for winner detection

**Business Rules:**
- Numbers must contain 5-8 unique integers
- Numbers range: 1-90
- **Board Pricing (exam requirement):**
  - 5 numbers = 20 DKK
  - 6 numbers = 40 DKK
  - 7 numbers = 80 DKK
  - 8 numbers = 160 DKK
- Saturday 5 PM purchase cutoff
- Repeating boards auto-purchased in subsequent games

---

### Game

Represents a weekly game/draw.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | Guid | PK | Unique identifier |
| WeekNumber | int | Required | ISO week number |
| Year | int | Required | Year |
| Status | GameStatus | Required | Active, Completed, Cancelled |
| WinningNumbers | int[] | Nullable, 3 elements | Draw results |
| StartedAt | DateTime | Required | Game opened |
| CompletedAt | DateTime | Nullable | Draw completed |
| CreatedAt | DateTime | Required | Record creation |

**GameStatus Enum:**
- Active (accepting boards)
- Completed (draw finished)
- Cancelled (game voided)

**Indexes:**
- Unique composite index on (Year, WeekNumber)
- Index on Status for active game lookup

**Business Rules:**
- Only one Active game at any time
- WinningNumbers set when status changes to Completed
- Winning board: all 3 winning numbers present

---

## Relationships

### Player → Transaction (1:N)
- Player has many Transactions
- Transaction belongs to one Player
- Cascade delete: No (preserve history)

### Player → Board (1:N)
- Player has many Boards
- Board belongs to one Player
- Cascade delete: No (preserve history)

### Game → Board (1:N)
- Game has many Boards
- Board belongs to one Game
- Cascade delete: No (preserve history)

### Transaction → Board (1:1)
- Purchase Transaction links to one Board
- Board has one purchase Transaction

---

## Persistence Rules

### Soft Deletes
- Player: Uses DeletedAt timestamp
- Other entities: Hard delete (cascade protection)

### Timestamps
All entities include:
- CreatedAt: Set on insert
- UpdatedAt: Set on insert and update (Player only)

### Concurrency
- Optimistic concurrency on Player (UpdatedAt)
- No concurrency control on transactions (append-only)

---

## Constraints

### Database Constraints
```sql
-- Player email uniqueness
ALTER TABLE Players ADD CONSTRAINT UQ_Player_Email UNIQUE (Email);

-- Game week uniqueness
ALTER TABLE Games ADD CONSTRAINT UQ_Game_YearWeek UNIQUE (Year, WeekNumber);

-- Board numbers array size
ALTER TABLE Boards ADD CONSTRAINT CK_Board_Numbers_Size
  CHECK (array_length(Numbers, 1) BETWEEN 5 AND 8);

-- Transaction amount sign by type
ALTER TABLE Transactions ADD CONSTRAINT CK_Transaction_Amount
  CHECK (
    (Type = 'Purchase' AND Amount < 0) OR
    (Type IN ('Deposit', 'Refund') AND Amount > 0)
  );
```

### Application Constraints
- Only one active game (enforced in service layer)
- Player balance must be positive to purchase
- Board numbers must be unique within board

---

## Migration Plan

### Initial Migration
1. Create all tables with relationships
2. Create indexes
3. Add constraints
4. Seed initial data (optional)

### Migration Commands
```bash
# Create migration
dotnet ef migrations add InitialDataModel \
  --project server/DeadPigeons.DataAccess \
  --startup-project server/DeadPigeons.Api

# Apply migration
dotnet ef database update \
  --project server/DeadPigeons.DataAccess \
  --startup-project server/DeadPigeons.Api

# Generate SQL script
dotnet ef migrations script \
  --project server/DeadPigeons.DataAccess \
  --startup-project server/DeadPigeons.Api \
  --output migrations.sql
```

---

## Query Patterns

### Player Balance
```csharp
var balance = await context.Transactions
    .Where(t => t.PlayerId == playerId && t.IsApproved)
    .SumAsync(t => t.Amount);
```

### Active Game
```csharp
var activeGame = await context.Games
    .SingleOrDefaultAsync(g => g.Status == GameStatus.Active);
```

### Winning Boards
```csharp
var winners = await context.Boards
    .Where(b => b.GameId == gameId)
    .Where(b => winningNumbers.All(n => b.Numbers.Contains(n)))
    .ToListAsync();
```

---

## Test Strategy

### Unit Tests (Local, No Docker)
- Entity validation logic
- Balance calculation
- Number validation (5-8 count)
- Game state transitions

### Integration Tests (CI Only, Docker Required)
- CRUD operations
- Relationship integrity
- Migration application
- Query performance
- Concurrent access

---

## Related Documentation

- [ADR-0010: Data Model Decisions](../adr/0010-data-model-decisions.md)
- [Sprint 3 Epic](../agile/sprint-03-epic.md)
- [How-To: Add Entity](../howto/add-entity.md)
