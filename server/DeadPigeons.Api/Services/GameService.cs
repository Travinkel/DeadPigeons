using DeadPigeons.Api.Dtos;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Services;

public class GameService : IGameService
{
    private readonly AppDbContext _db;

    public GameService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<GameResponse>> GetAllAsync()
    {
        var games = await _db.Games
            .Select(g => new
            {
                g.Id,
                g.WeekNumber,
                g.Year,
                g.Status,
                g.WinningNumbers,
                g.StartedAt,
                g.CompletedAt,
                g.CreatedAt,
                BoardCount = g.Boards.Count
            })
            .ToListAsync();

        return games.Select(g => new GameResponse(
            g.Id,
            g.WeekNumber,
            g.Year,
            g.Status.ToString(),
            g.WinningNumbers,
            g.StartedAt,
            g.CompletedAt,
            g.CreatedAt,
            g.BoardCount));
    }

    public async Task<GameResponse?> GetByIdAsync(Guid id)
    {
        var game = await _db.Games
            .Where(g => g.Id == id)
            .Select(g => new
            {
                g.Id,
                g.WeekNumber,
                g.Year,
                g.Status,
                g.WinningNumbers,
                g.StartedAt,
                g.CompletedAt,
                g.CreatedAt,
                BoardCount = g.Boards.Count
            })
            .FirstOrDefaultAsync();

        return game == null ? null : new GameResponse(
            game.Id,
            game.WeekNumber,
            game.Year,
            game.Status.ToString(),
            game.WinningNumbers,
            game.StartedAt,
            game.CompletedAt,
            game.CreatedAt,
            game.BoardCount);
    }

    public async Task<GameResponse?> GetActiveAsync()
    {
        var game = await _db.Games
            .Where(g => g.Status == GameStatus.Active)
            .Select(g => new
            {
                g.Id,
                g.WeekNumber,
                g.Year,
                g.Status,
                g.WinningNumbers,
                g.StartedAt,
                g.CompletedAt,
                g.CreatedAt,
                BoardCount = g.Boards.Count
            })
            .FirstOrDefaultAsync();

        // If no active game, promote the next pending game to active (closest by year/week)
        if (game == null)
        {
            var nextPending = await _db.Games
                .Where(g => g.Status == GameStatus.Pending)
                .OrderBy(g => g.Year)
                .ThenBy(g => g.WeekNumber)
                .FirstOrDefaultAsync();

            if (nextPending != null)
            {
                nextPending.Status = GameStatus.Active;
                nextPending.StartedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                game = new
                {
                    nextPending.Id,
                    nextPending.WeekNumber,
                    nextPending.Year,
                    nextPending.Status,
                    nextPending.WinningNumbers,
                    nextPending.StartedAt,
                    nextPending.CompletedAt,
                    nextPending.CreatedAt,
                    BoardCount = nextPending.Boards.Count
                };
            }
        }

        return game == null
            ? null
            : new GameResponse(
                game.Id,
                game.WeekNumber,
                game.Year,
                game.Status.ToString(),
                game.WinningNumbers,
                game.StartedAt,
                game.CompletedAt,
                game.CreatedAt,
                game.BoardCount);
    }

    public async Task<GameResponse> CreateAsync(CreateGameRequest request)
    {
        // Check for existing active game
        var activeGame = await _db.Games
            .AnyAsync(g => g.Status == GameStatus.Active);

        if (activeGame)
            throw new InvalidOperationException("An active game already exists");

        // Check for duplicate week/year
        var exists = await _db.Games
            .AnyAsync(g => g.Year == request.Year && g.WeekNumber == request.WeekNumber);

        if (exists)
            throw new ArgumentException($"Game for week {request.WeekNumber}/{request.Year} already exists");

        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = request.WeekNumber,
            Year = request.Year,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        return new GameResponse(
            game.Id,
            game.WeekNumber,
            game.Year,
            game.Status.ToString(),
            game.WinningNumbers,
            game.StartedAt,
            game.CompletedAt,
            game.CreatedAt,
            0);
    }

    public async Task<GameResultResponse?> CompleteAsync(Guid id, CompleteGameRequest request)
    {
        var game = await _db.Games
            .Include(g => g.Boards)
            .ThenInclude(b => b.Player)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (game == null) return null;

        if (game.Status != GameStatus.Active)
            throw new InvalidOperationException("Game is not active");

        // Validate winning numbers
        if (request.WinningNumbers.Length != 3)
            throw new ArgumentException("Must provide exactly 3 winning numbers");

        if (request.WinningNumbers.Distinct().Count() != 3)
            throw new ArgumentException("Winning numbers must be unique");

        if (request.WinningNumbers.Any(n => n < 1 || n > 90))
            throw new ArgumentException("Winning numbers must be between 1 and 90");

        // Update game
        game.Status = GameStatus.Completed;
        game.WinningNumbers = request.WinningNumbers;
        game.CompletedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        // Find winning boards (boards containing all 3 winning numbers)
        var winners = game.Boards
            .Where(b => request.WinningNumbers.All(n => b.Numbers.Contains(n)))
            .Select(b => new BoardWithPlayerResponse(
                b.Id,
                b.PlayerId,
                b.Player.Name,
                b.GameId,
                b.Numbers,
                b.IsRepeating,
                b.CreatedAt))
            .ToList();

        return new GameResultResponse(
            game.Id,
            request.WinningNumbers,
            game.Boards.Count,
            winners.Count,
            winners);
    }
}
