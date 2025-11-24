using System.Globalization;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.DataAccess;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<Player>();

        // Upsert admin
        var admin = await context.Players.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Email == "admin@jerneif.dk");
        if (admin == null)
        {
            admin = new Player
            {
                Id = Guid.NewGuid(),
                Name = "Admin",
                Email = "admin@jerneif.dk",
                Phone = "+4512345678",
                IsActive = true,
                Role = Role.Admin
            };
            admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");
            context.Players.Add(admin);
        }
        else
        {
            if (string.IsNullOrWhiteSpace(admin.PasswordHash))
            {
                admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");
            }
            // Preserve admin-chosen password/flags; only revive if soft-deleted.
            admin.DeletedAt = null;
        }

        // Upsert test player
        var player = await context.Players.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Email == "player@jerneif.dk");
        if (player == null)
        {
            player = new Player
            {
                Id = Guid.NewGuid(),
                Name = "Test Spiller",
                Email = "player@jerneif.dk",
                Phone = "+4587654321",
                IsActive = true,
                Role = Role.Player
            };
            player.PasswordHash = hasher.HashPassword(player, "Player123!");
            context.Players.Add(player);
        }
        else
        {
            if (string.IsNullOrWhiteSpace(player.PasswordHash))
            {
                player.PasswordHash = hasher.HashPassword(player, "Player123!");
            }
            player.DeletedAt = null;
        }

        // Seed games around the current year to avoid out-of-range failures
        var now = DateTime.UtcNow;
        var currentYear = now.Year;
        var startYear = currentYear - 1;
        var endYear = currentYear + 5;

        if (!await context.Games.AnyAsync())
        {
            var seededGames = GenerateGames(startYear, endYear).ToList();
            context.Games.AddRange(seededGames);
            await context.SaveChangesAsync();
        }

        var games = await context.Games.ToListAsync();

        // Ensure exactly one active game
        if (!games.Any(g => g.Status == GameStatus.Active))
        {
            var currentWeek = ISOWeek.GetWeekOfYear(now);

            // Promote pending matching current week/year
            var currentPending = games
                .FirstOrDefault(g => g.Status == GameStatus.Pending && g.Year == currentYear && g.WeekNumber == currentWeek);

            if (currentPending != null)
            {
                currentPending.Status = GameStatus.Active;
                currentPending.StartedAt = DateTime.UtcNow;
                await context.SaveChangesAsync();
            }
            else
            {
                // Promote earliest pending
                var nextPending = games
                    .Where(g => g.Status == GameStatus.Pending)
                    .OrderBy(g => g.Year)
                    .ThenBy(g => g.WeekNumber)
                    .FirstOrDefault();

                if (nextPending != null)
                {
                    nextPending.Status = GameStatus.Active;
                    nextPending.StartedAt = DateTime.UtcNow;
                    await context.SaveChangesAsync();
                }
                else
                {
                    // Create new active game for current week/year
                    var newGame = new Game
                    {
                        Id = Guid.NewGuid(),
                        WeekNumber = currentWeek,
                        Year = currentYear,
                        Status = GameStatus.Active,
                        StartedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow
                    };
                    context.Games.Add(newGame);
                    await context.SaveChangesAsync();
                    games.Add(newGame);
                }
            }
        }

        // Refresh games after potential changes
        games = await context.Games.ToListAsync();

        // Find current active game for demo board attachment
        var activeGame = games.First(g => g.Status == GameStatus.Active);
        var currentWeekLabel = ISOWeek.GetWeekOfYear(now);

        // Seed demo transactions for player balance (exam demo requirement) if not already present
        if (!await context.Transactions.AnyAsync(t => t.MobilePayTransactionId == "INIT-APPROVED-500"))
        {
            var approvedDeposit = new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = player.Id,
                Amount = 500m,
                Type = TransactionType.Deposit,
                MobilePayTransactionId = "INIT-APPROVED-500",
                IsApproved = true,
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                ApprovedAt = DateTime.UtcNow.AddDays(-7),
                ApprovedById = admin.Id
            };
            context.Transactions.Add(approvedDeposit);
        }

        if (!await context.Transactions.AnyAsync(t => t.MobilePayTransactionId == "INIT-PENDING-200"))
        {
            var pendingDeposit = new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = player.Id,
                Amount = 200m,
                Type = TransactionType.Deposit,
                MobilePayTransactionId = "INIT-PENDING-200",
                IsApproved = false,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            };
            context.Transactions.Add(pendingDeposit);
        }

        // Seed demo board/purchase if not already present (attach to active game)
        if (!await context.Boards.AnyAsync(b => b.PlayerId == player.Id && b.GameId == activeGame.Id))
        {
            var boardTransaction = new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = player.Id,
                Amount = -20m,
                Type = TransactionType.Purchase,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                ApprovedAt = DateTime.UtcNow.AddDays(-1),
                ApprovedById = admin.Id
            };

            var demoBoard = new Board
            {
                Id = Guid.NewGuid(),
                PlayerId = player.Id,
                GameId = activeGame.Id,
                Numbers = new[] { 3, 7, 12, 15, 18 },
                IsRepeating = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                TransactionId = boardTransaction.Id
            };

            context.Transactions.Add(boardTransaction);
            context.Boards.Add(demoBoard);
        }

        await context.SaveChangesAsync();
    }

    private static IEnumerable<Game> GenerateGames(int startYear, int endYear)
    {
        var games = new List<Game>();
        var now = DateTime.UtcNow;
        var currentWeek = ISOWeek.GetWeekOfYear(now);
        var currentYear = now.Year;

        for (int year = startYear; year <= endYear; year++)
        {
            int weeksInYear = ISOWeek.GetWeeksInYear(year);

            for (int week = 1; week <= weeksInYear; week++)
            {
                var status = DetermineGameStatus(year, week, currentYear, currentWeek);
                var startDate = DateTime.SpecifyKind(ISOWeek.ToDateTime(year, week, DayOfWeek.Monday), DateTimeKind.Utc);

                games.Add(new Game
                {
                    Id = Guid.NewGuid(),
                    WeekNumber = week,
                    Year = year,
                    Status = status,
                    StartedAt = startDate,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        return games;
    }

    private static GameStatus DetermineGameStatus(int year, int week, int currentYear, int currentWeek)
    {
        if (year < currentYear || (year == currentYear && week < currentWeek))
            return GameStatus.Completed;

        if (year == currentYear && week == currentWeek)
            return GameStatus.Active;

        return GameStatus.Pending;
    }
}
