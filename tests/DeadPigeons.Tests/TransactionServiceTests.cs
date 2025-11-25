using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DeadPigeons.Tests;

public class TransactionServiceTests : IClassFixture<TestServiceFixture>, IDisposable
{
    private readonly AppDbContext _db;
    private readonly ITransactionService _service;
    private readonly IServiceScope _scope;

    public TransactionServiceTests(TestServiceFixture fixture)
    {
        _scope = fixture.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<AppDbContext>();
        _service = _scope.ServiceProvider.GetRequiredService<ITransactionService>();
    }

    public void Dispose() => _scope.Dispose();

    [Fact]
    public async Task CreateDepositAsync_WithPositiveAmount_Succeeds()
    {
        // Arrange
        var playerId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        _db.Players.Add(new Player
        {
            Id = playerId,
            Name = "Test User",
            Email = "test@local",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        var request = new CreateDepositRequest(playerId, 100m, "MP123");

        // Act
        var result = await _service.CreateDepositAsync(request);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(playerId, result.PlayerId);
        Assert.Equal(100m, result.Amount);
        Assert.Equal("Deposit", result.Type);
        Assert.Equal("MP123", result.MobilePayTransactionId);
        Assert.False(result.IsApproved);
    }

    [Fact]
    public async Task CreateDepositAsync_WithZeroAmount_ThrowsException()
    {
        // Arrange
        var request = new CreateDepositRequest(Guid.NewGuid(), 0m, "MP-ZERO");

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.CreateDepositAsync(request));
    }

    [Fact]
    public async Task CreateDepositAsync_WithNegativeAmount_ThrowsException()
    {
        // Arrange
        var request = new CreateDepositRequest(Guid.NewGuid(), -50m, "MP-NEG");

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.CreateDepositAsync(request));
    }

    [Fact]
    public async Task ApproveAsync_SetsApprovalFields()
    {
        // Arrange
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = Guid.NewGuid(),
            Amount = 100m,
            Type = TransactionType.Deposit,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow
        };
        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();

        var adminId = Guid.NewGuid();

        // Act
        var result = await _service.ApproveAsync(transaction.Id, adminId);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsApproved);
        Assert.NotNull(result.ApprovedAt);
        Assert.Equal(adminId, result.ApprovedById);
    }

    [Fact]
    public async Task GetPendingAsync_ReturnsOnlyUnapproved()
    {
        // Arrange
        var playerId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        _db.Players.Add(new Player
        {
            Id = playerId,
            Name = "Pending User",
            Email = "pending@local",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        _db.Transactions.Add(
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                Amount = 100m,
                Type = TransactionType.Deposit,
                MobilePayTransactionId = "PENDING-TEST",
                IsApproved = false,
                CreatedAt = DateTime.UtcNow
            });
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.GetPendingAsync();

        // Assert
        var list = result.ToList();
        Assert.Single(list);
        Assert.Equal(100m, list.First().Amount);
    }
}
