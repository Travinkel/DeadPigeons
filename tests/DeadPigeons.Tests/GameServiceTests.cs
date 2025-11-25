using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DeadPigeons.Tests;

public class GameServiceTests : IClassFixture<TestServiceFixture>, IDisposable
{
    private readonly AppDbContext _db;
    private readonly IGameService _service;
    private readonly IServiceScope _scope;

    public GameServiceTests(TestServiceFixture fixture)
    {
        _scope = fixture.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<AppDbContext>();
        _service = _scope.ServiceProvider.GetRequiredService<IGameService>();

    }

    public void Dispose() => _scope.Dispose();

    [Fact]
    public async Task CreateAsync_CreatesActiveGame()
    {
        // Arrange
        var request = new CreateGameRequest(47, 2025);

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(47, result.WeekNumber);
        Assert.Equal(2025, result.Year);
        Assert.Equal("Active", result.Status);
        Assert.Null(result.WinningNumbers);
    }

    [Fact]
    public async Task CreateAsync_WithExistingActiveGame_ThrowsException()
    {
        // Arrange
        var existingGame = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 46,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(existingGame);
        await _db.SaveChangesAsync();

        var request = new CreateGameRequest(47, 2025);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.CreateAsync(request));
        Assert.Contains("active game already exists", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_DuplicateWeekYear_ThrowsException()
    {
        // Arrange
        var existingGame = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Completed, // Not active
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(existingGame);
        await _db.SaveChangesAsync();

        var request = new CreateGameRequest(47, 2025); // Same week/year

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.CreateAsync(request));
        Assert.Contains("already exists", ex.Message);
    }

    [Fact]
    public async Task CompleteAsync_SetsWinningNumbersAndStatus()
    {
        // Arrange
        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        var request = new CompleteGameRequest(new int[] { 5, 10, 15 });

        // Act
        var result = await _service.CompleteAsync(game.Id, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(new int[] { 5, 10, 15 }, result.WinningNumbers);

        // Verify game status updated
        var updatedGame = await _db.Games.FindAsync(game.Id);
        Assert.Equal(GameStatus.Completed, updatedGame!.Status);
        Assert.NotNull(updatedGame.CompletedAt);
    }

    [Fact]
    public async Task CompleteAsync_NotActiveGame_ThrowsException()
    {
        // Arrange
        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Completed,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        var request = new CompleteGameRequest(new int[] { 5, 10, 15 });

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.CompleteAsync(game.Id, request));
        Assert.Contains("not active", ex.Message);
    }

    [Theory]
    [InlineData(new int[] { 10, 20 })] // Too few
    [InlineData(new int[] { 10, 20, 30, 40 })] // Too many
    public async Task CompleteAsync_InvalidWinningNumberCount_ThrowsException(int[] winningNumbers)
    {
        // Arrange
        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        var request = new CompleteGameRequest(winningNumbers);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.CompleteAsync(game.Id, request));
        Assert.Contains("3 winning numbers", ex.Message);
    }

    [Fact]
    public async Task CompleteAsync_DuplicateWinningNumbers_ThrowsException()
    {
        // Arrange
        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        var request = new CompleteGameRequest(new int[] { 5, 5, 15 });

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.CompleteAsync(game.Id, request));
        Assert.Contains("unique", ex.Message);
    }

    [Fact]
    public async Task CompleteAsync_FindsWinningBoards()
    {
        // Arrange
        var playerId = Guid.NewGuid();
        var player = new Player
        {
            Id = playerId,
            Name = "Test",
            Email = "test@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);

        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);

        // Winning board (contains all 3: 5, 10, 15)
        var winningBoard = new Board
        {
            Id = Guid.NewGuid(),
            PlayerId = playerId,
            GameId = game.Id,
            Numbers = new int[] { 5, 10, 15, 1, 2 },
            CreatedAt = DateTime.UtcNow,
            TransactionId = Guid.NewGuid()
        };

        // Losing board (missing 15)
        var losingBoard = new Board
        {
            Id = Guid.NewGuid(),
            PlayerId = playerId,
            GameId = game.Id,
            Numbers = new int[] { 5, 10, 1, 2, 3 },
            CreatedAt = DateTime.UtcNow,
            TransactionId = Guid.NewGuid()
        };

        _db.Boards.AddRange(winningBoard, losingBoard);
        await _db.SaveChangesAsync();

        var request = new CompleteGameRequest(new int[] { 5, 10, 15 });

        // Act
        var result = await _service.CompleteAsync(game.Id, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.TotalBoards);
        Assert.Equal(1, result.WinningBoards);
        Assert.Single(result.Winners);
        Assert.Equal(winningBoard.Id, result.Winners.First().Id);
    }

    [Fact]
    public async Task GetActiveAsync_ReturnsActiveGame()
    {
        // Arrange
        var activeGame = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 47,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        var completedGame = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 46,
            Year = 2025,
            Status = GameStatus.Completed,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.AddRange(activeGame, completedGame);
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.GetActiveAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(activeGame.Id, result.Id);
        Assert.Equal("Active", result.Status);
    }
}
