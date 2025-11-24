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
            context.Players.Add(admin);
        }
        admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");
        admin.IsActive = true;
        admin.Role = Role.Admin;
        admin.DeletedAt = null;

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
            context.Players.Add(player);
        }
        player.PasswordHash = hasher.HashPassword(player, "Player123!");
        player.IsActive = true;
        player.Role = Role.Player;
        player.DeletedAt = null;

        // Seed games around the current year to avoid out-of-range failures
        var now = DateTime.UtcNow;
        var currentYear = now.Year;
        var startYear = Math.Min(2024, currentYear);          // include historical lower bound
        var endYear = Math.Max(currentYear + 5, 2044);        // at least 5 years ahead or tip range

        // Seed games for the computed range (per exam Tip 1)
        var games = await context.Games.AnyAsync()
            ? await context.Games.ToListAsync()
            : GenerateGames(startYear, endYear).ToList();

        if (!await context.Games.AnyAsync())
        {
            context.Games.AddRange(games);
        }

        // Find current week's game for demo boards (guard against missing week)
        var currentWeek = ISOWeek.GetWeekOfYear(now);
        var currentGame = games.FirstOrDefault(g => g.Year == currentYear && g.WeekNumber == currentWeek)
                          ?? games.FirstOrDefault(g => g.Status == GameStatus.Active)
                          ?? games.First(); // fallback to any game

        // Seed demo transactions for player balance (exam demo requirement) if not already present
        if (!await context.Transactions.AnyAsync(t => t.MobilePayTransactionId == "DEMO-001"))
        {
            var approvedDeposit = new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = player.Id,
                Amount = 500m,
                Type = TransactionType.Deposit,
                MobilePayTransactionId = "DEMO-001",
                IsApproved = true,
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                ApprovedAt = DateTime.UtcNow.AddDays(-7),
                ApprovedById = admin.Id
            };
            context.Transactions.Add(approvedDeposit);
        }

        if (!await context.Transactions.AnyAsync(t => t.MobilePayTransactionId == "DEMO-002"))
        {
            var pendingDeposit = new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = player.Id,
                Amount = 200m,
                Type = TransactionType.Deposit,
                MobilePayTransactionId = "DEMO-002",
                IsApproved = false,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            };
            context.Transactions.Add(pendingDeposit);
        }

        // Seed demo board/purchase if not already present
        if (!await context.Boards.AnyAsync(b => b.PlayerId == player.Id && b.GameId == currentGame.Id))
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
                GameId = currentGame.Id,
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
