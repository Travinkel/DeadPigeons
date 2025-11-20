# Sprint 2 Increment — Data Model + Basic Endpoints

**Sprint:** 2
**Branch:** `feature/data-model`
**PR:** #3
**Status:** CI Pending

---

## Delivered Artifacts

### Entities
- [x] Player (IsActive=false default, Phone required, soft delete)
- [x] Transaction (type enum, IsApproved for balance)
- [x] Board (PostgreSQL array for numbers)
- [x] Game (status enum, winning numbers array)

### EF Core Configurations
- [x] PlayerConfiguration with soft delete query filter
- [x] TransactionConfiguration with indexes
- [x] BoardConfiguration with array column
- [x] GameConfiguration with unique constraint

### Migration
- [x] `20251120161739_DataModel.cs` generated
- [x] Creates all tables with relationships
- [x] Indexes and constraints applied

### Services
- [x] PlayerService (CRUD + GetBalance)
- [x] TransactionService (deposit, approve, pending)
- [x] BoardService (create, get by player/game)
- [x] GameService (CRUD + complete with winning numbers)

### Controllers
- [x] PlayersController
- [x] TransactionsController
- [x] BoardsController
- [x] GamesController

### DTOs
- [x] PlayerDtos (Create, Update, Response)
- [x] TransactionDtos
- [x] BoardDtos
- [x] GameDtos

### Tests
- [x] 30 unit tests passing locally
  - PlayerServiceTests (7)
  - TransactionServiceTests (8)
  - BoardServiceTests (8)
  - GameServiceTests (7)
- [ ] Integration tests pending CI fix

### Documentation
- [x] Security notice in README
- [x] Agile docs consolidated (removed old epics/tasks/userstories)
- [x] Sprint epics aligned with new structure
- [x] MVP-Definition updated

### CI/CD
- [x] Fixed workflow branch triggers
- [x] Added Postgres health checks
- [x] Disabled TestContainers Ryuk
- [x] Added HTML test report with ReportGenerator
- [ ] Awaiting green CI run

---

## Files Changed

### New Files
```
server/DeadPigeons.DataAccess/
├── Entities/
│   ├── Transaction.cs
│   ├── Board.cs
│   └── Game.cs
├── Configurations/
│   ├── TransactionConfiguration.cs
│   ├── BoardConfiguration.cs
│   └── GameConfiguration.cs
├── Enums/
│   ├── TransactionType.cs
│   └── GameStatus.cs
└── Migrations/
    └── 20251120161739_DataModel.cs

server/DeadPigeons.Api/
├── Services/
│   ├── IPlayerService.cs
│   ├── ITransactionService.cs
│   ├── IBoardService.cs
│   └── IGameService.cs
│   ├── TransactionService.cs
│   ├── BoardService.cs
│   └── GameService.cs
├── Dtos/
│   ├── TransactionDtos.cs
│   ├── BoardDtos.cs
│   └── GameDtos.cs
└── Controllers/
    ├── TransactionsController.cs
    ├── BoardsController.cs
    └── GamesController.cs

tests/DeadPigeons.Tests/
├── TransactionServiceTests.cs
├── BoardServiceTests.cs
└── GameServiceTests.cs

docs/agile/
├── sprint-01-devops-review.md (renamed)
├── sprint-02-increment.md (this file)
├── sprint-02-review.md
└── sprint-02-retrospective.md
```

### Modified Files
- server/DeadPigeons.DataAccess/Entities/Player.cs
- server/DeadPigeons.DataAccess/Configurations/PlayerConfiguration.cs
- server/DeadPigeons.DataAccess/AppDbContext.cs
- server/DeadPigeons.Api/Services/PlayerService.cs
- server/DeadPigeons.Api/Controllers/PlayersController.cs
- server/DeadPigeons.Api/Program.cs
- tests/DeadPigeons.Tests/PlayerServiceTests.cs
- tests/DeadPigeons.IntegrationTests/*.cs
- .github/workflows/ci.yml
- README.md
- docs/agile/MVP-Definition.md
- docs/agile/roadmap.md
- docs/reference/data-model.md

### Deleted Files
- docs/agile/epics/* (old structure)
- docs/agile/userstories/* (old structure)
- docs/agile/tasks/* (old structure)

---

## Remaining Work

1. **CI Green** — Fix TestContainers/ReportGenerator issues
2. **NSwag Regenerate** — After CI passes
3. **Merge PR #3** — After CI green
4. **Tag Release** — `v1.2.0-data-model`

---

## Next Sprint

**Sprint 3: Auth & Security** (CRITICAL for CDS.Security exam)
- JWT authentication
- Authorization policies (Admin/Player)
- DataAnnotations validation
- XUnit.DependencyInjection migration
