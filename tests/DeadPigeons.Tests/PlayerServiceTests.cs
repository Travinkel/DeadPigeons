using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DeadPigeons.Tests;

public class PlayerServiceTests : IClassFixture<TestServiceFixture>, IDisposable
{
    private readonly AppDbContext _db;
    private readonly IPlayerService _service;
    private readonly IServiceScope _scope;

    public PlayerServiceTests(TestServiceFixture fixture)
    {
        _scope = fixture.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<AppDbContext>();
        _service = _scope.ServiceProvider.GetRequiredService<IPlayerService>();

        _db.Database.EnsureDeleted();
        _db.Database.EnsureCreated();
    }

    public void Dispose() => _scope.Dispose();

    [Fact]
    public async Task CreateAsync_ShouldCreatePlayer()
    {
        // Arrange
        var request = new CreatePlayerRequest("John Doe", "john@example.com", "12345678");

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("John Doe", result.Name);
        Assert.Equal("john@example.com", result.Email);
        Assert.Equal("12345678", result.Phone);
        Assert.False(result.IsActive);  // Players are inactive by default per exam spec
    }

    [Fact]
    public async Task DeleteAsync_ShouldSoftDelete()
    {
        // Arrange
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.DeleteAsync(player.Id);

        // Assert
        Assert.True(result);

        // Verify soft delete was applied
        var deletedPlayer = await _db.Players
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.Id == player.Id);

        Assert.NotNull(deletedPlayer);
        Assert.NotNull(deletedPlayer.DeletedAt);
    }

    [Fact]
    public async Task DeleteAsync_SetsDeletedAtTimestamp()
    {
        // Arrange
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            Phone = "12345678",
            IsActive = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        // Act
        await _service.DeleteAsync(player.Id);

        // Assert - verify DeletedAt is set (query filter is tested in integration tests)
        var deletedPlayer = await _db.Players
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.Id == player.Id);

        Assert.NotNull(deletedPlayer);
        Assert.NotNull(deletedPlayer.DeletedAt);
    }

    [Fact]
    public async Task GetBalanceAsync_WithNoTransactions_ReturnsZero()
    {
        // Arrange
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        // Act
        var balance = await _service.GetBalanceAsync(player.Id);

        // Assert
        Assert.Equal(0m, balance);
    }

    [Fact]
    public async Task GetBalanceAsync_SumsApprovedTransactionsOnly()
    {
        // Arrange
        var playerId = Guid.NewGuid();
        var player = new Player
        {
            Id = playerId,
            Name = "Test Player",
            Email = "test@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);

        // Add transactions: 100 approved, 50 approved, 30 not approved
        _db.Transactions.AddRange(
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                Amount = 100m,
                Type = TransactionType.Deposit,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            },
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                Amount = 50m,
                Type = TransactionType.Deposit,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            },
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                Amount = 30m,
                Type = TransactionType.Deposit,
                IsApproved = false, // Not approved
                CreatedAt = DateTime.UtcNow
            }
        );
        await _db.SaveChangesAsync();

        // Act
        var balance = await _service.GetBalanceAsync(playerId);

        // Assert
        Assert.Equal(150m, balance); // Only approved: 100 + 50
    }

    [Fact]
    public async Task GetBalanceAsync_IncludesNegativePurchases()
    {
        // Arrange
        var playerId = Guid.NewGuid();
        var player = new Player
        {
            Id = playerId,
            Name = "Test Player",
            Email = "test@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);

        _db.Transactions.AddRange(
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                Amount = 100m,
                Type = TransactionType.Deposit,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            },
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                Amount = -25m, // Purchase
                Type = TransactionType.Purchase,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            }
        );
        await _db.SaveChangesAsync();

        // Act
        var balance = await _service.GetBalanceAsync(playerId);

        // Assert
        Assert.Equal(75m, balance); // 100 - 25
    }
}
