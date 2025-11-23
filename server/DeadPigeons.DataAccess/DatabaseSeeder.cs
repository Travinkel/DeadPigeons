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
        var games = GenerateGames(2024, 2044);
        context.Games.AddRange(games);

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
                var startDate = ISOWeek.ToDateTime(year, week, DayOfWeek.Monday);

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
