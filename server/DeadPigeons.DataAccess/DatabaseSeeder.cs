using System.Globalization;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.DataAccess;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Check if already seeded
        if (await context.Players.AnyAsync())
            return;

        // Create admin user
        var admin = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Email = "admin@jerneif.dk",
            Phone = "+4512345678",
            IsActive = true,
            Role = Role.Admin,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!")
        };

        // Create test player
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Spiller",
            Email = "player@jerneif.dk",
            Phone = "+4587654321",
            IsActive = true,
            Role = Role.Player,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Player123!")
        };

        context.Players.AddRange(admin, player);

        // Seed games for 20 years (per exam Tip 1)
        var games = GenerateGames(2024, 2044).ToList();
        context.Games.AddRange(games);

        // Find current week's game for demo boards
        var now = DateTime.UtcNow;
        var currentWeek = ISOWeek.GetWeekOfYear(now);
        var currentYear = now.Year;
        var currentGame = games.First(g => g.Year == currentYear && g.WeekNumber == currentWeek);

        // Seed demo transactions for player balance (exam demo requirement)
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

        // Pending deposit for admin approval demo
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

        context.Transactions.AddRange(approvedDeposit, pendingDeposit);

        // Seed demo boards for current week (5 numbers = 20 DKK)
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
