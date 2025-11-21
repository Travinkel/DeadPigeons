using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Tests;

public class TransactionServiceTests
{
    private readonly AppDbContext _db;
    private readonly ITransactionService _service;

    public TransactionServiceTests(AppDbContext db, ITransactionService service)
    {
        _db = db;
        _service = service;
    }

    [Fact]
    public async Task CreateDepositAsync_WithPositiveAmount_Succeeds()
    {
        // Arrange
        var playerId = Guid.NewGuid();
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
        var request = new CreateDepositRequest(Guid.NewGuid(), 0m, null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.CreateDepositAsync(request));
    }

    [Fact]
    public async Task CreateDepositAsync_WithNegativeAmount_ThrowsException()
    {
        // Arrange
        var request = new CreateDepositRequest(Guid.NewGuid(), -50m, null);

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
        var request = new ApproveTransactionRequest(adminId);

        // Act
        var result = await _service.ApproveAsync(transaction.Id, request);

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
        _db.Transactions.AddRange(
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = Guid.NewGuid(),
                Amount = 100m,
                Type = TransactionType.Deposit,
                IsApproved = false,
                CreatedAt = DateTime.UtcNow
            },
            new Transaction
            {
                Id = Guid.NewGuid(),
                PlayerId = Guid.NewGuid(),
                Amount = 50m,
                Type = TransactionType.Deposit,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            }
        );
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.GetPendingAsync();

        // Assert
        Assert.Single(result);
        Assert.Equal(100m, result.First().Amount);
    }
}
