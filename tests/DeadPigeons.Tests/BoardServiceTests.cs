using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DeadPigeons.Tests;

public class BoardServiceTests : IClassFixture<TestServiceFixture>, IDisposable
{
    private readonly AppDbContext _db;
    private readonly IBoardService _boardService;
    private readonly IPlayerService _playerService;
    private readonly IServiceScope _scope;

    public BoardServiceTests(TestServiceFixture fixture)
    {
        _scope = fixture.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<AppDbContext>();
        _boardService = _scope.ServiceProvider.GetRequiredService<IBoardService>();
        _playerService = _scope.ServiceProvider.GetRequiredService<IPlayerService>();

    }

    public void Dispose() => _scope.Dispose();

    [Theory]
    [InlineData(new int[] { 1, 2, 3, 4 })] // Too few
    [InlineData(new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 })] // Too many
    public async Task CreateAsync_InvalidNumberCount_ThrowsException(int[] numbers)
    {
        // Arrange
        var request = new CreateBoardRequest(Guid.NewGuid(), Guid.NewGuid(), numbers, false, "MP-BUY-TEST");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _boardService.CreateAsync(request));
        Assert.Contains("5-8 numbers", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_DuplicateNumbers_ThrowsException()
    {
        // Arrange
        var numbers = new int[] { 1, 2, 3, 3, 5 }; // Duplicate 3
        var request = new CreateBoardRequest(Guid.NewGuid(), Guid.NewGuid(), numbers, false, "MP-BUY-TEST");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _boardService.CreateAsync(request));
        Assert.Contains("unique", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_NumberOutOfRange_ThrowsException()
    {
        // Arrange
        var numbers = new int[] { 0, 1, 2, 3, 4 }; // 0 is invalid
        var request = new CreateBoardRequest(Guid.NewGuid(), Guid.NewGuid(), numbers, false, "MP-BUY-TEST");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _boardService.CreateAsync(request));
        Assert.Contains("between 1 and 16", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_NumberTooHigh_ThrowsException()
    {
        // Arrange
        var numbers = new int[] { 1, 2, 3, 4, 17 }; // 17 is invalid (max is 16)
        var request = new CreateBoardRequest(Guid.NewGuid(), Guid.NewGuid(), numbers, false, "MP-BUY-TEST");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _boardService.CreateAsync(request));
        Assert.Contains("between 1 and 16", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_GameNotActive_ThrowsException()
    {
        // Arrange
        var playerId = Guid.NewGuid();
        var player = new Player
        {
            Id = playerId,
            Name = "Test",
            Email = "test@example.com",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);

        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 1,
            Year = 2025,
            Status = GameStatus.Completed, // Not active
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        var numbers = new int[] { 1, 2, 3, 4, 5 };
        var request = new CreateBoardRequest(playerId, game.Id, numbers, false, "MP-BUY-TEST");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() =>
            _boardService.CreateAsync(request));
        Assert.Contains("not active", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_InsufficientBalance_ThrowsException()
    {
        // Arrange
        var playerId = Guid.NewGuid();
        var player = new Player
        {
            Id = playerId,
            Name = "Test",
            Email = "test@example.com",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);

        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 1,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        // No transactions = 0 balance
        // 5 numbers = 20 DKK cost
        var numbers = new int[] { 1, 2, 3, 4, 5 };
        var request = new CreateBoardRequest(playerId, game.Id, numbers, false, "MP-BUY-TEST");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _boardService.CreateAsync(request));
        Assert.Contains("Insufficient balance", ex.Message);
    }

    [Fact]
    public async Task CreateAsync_ValidBoard_CreatesTransactionAndBoard()
    {
        // Arrange
        var playerId = Guid.NewGuid();
        var player = new Player
        {
            Id = playerId,
            Name = "Test",
            Email = "test@example.com",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);

        // Add balance (100 DKK)
        _db.Transactions.Add(new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = playerId,
            Amount = 100m,
            Type = TransactionType.Deposit,
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        });

        var game = new Game
        {
            Id = Guid.NewGuid(),
            WeekNumber = 1,
            Year = 2025,
            Status = GameStatus.Active,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        // 5 numbers = 20 DKK
        var numbers = new int[] { 1, 2, 3, 4, 5 };
        var request = new CreateBoardRequest(playerId, game.Id, numbers, false, "MP-BUY-TEST");

        // Act
        var result = await _boardService.CreateAsync(request);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(numbers, result.Numbers);

        // Verify transaction was created
        var purchaseTransaction = await _db.Transactions
            .FirstOrDefaultAsync(t => t.Id == result.TransactionId);
        Assert.NotNull(purchaseTransaction);
        Assert.Equal(-20m, purchaseTransaction.Amount);
        Assert.Equal(TransactionType.Purchase, purchaseTransaction.Type);
        Assert.True(purchaseTransaction.IsApproved);

        // Verify balance deducted
        var newBalance = await _playerService.GetBalanceAsync(playerId);
        Assert.Equal(80m, newBalance);
    }
}
