using DeadPigeons.Api.Dtos;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _db;
    private readonly ILogger<TransactionService> _logger;

    public TransactionService(AppDbContext db, ILogger<TransactionService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<TransactionResponse>> GetByPlayerIdAsync(Guid playerId)
    {
        var results = await _db.Transactions
            .Where(t => t.PlayerId == playerId)
            .OrderByDescending(t => t.CreatedAt)
            .Join(_db.Players, t => t.PlayerId, p => p.Id, (t, p) => new { t, p })
            .Select(x => new TransactionResponse(
                x.t.Id,
                x.t.PlayerId,
                x.t.Amount,
                x.t.Type.ToString(),
                x.t.MobilePayTransactionId,
                x.t.IsApproved,
                x.t.CreatedAt,
                x.t.ApprovedAt,
                x.t.ApprovedById,
                !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : x.p.Email))
            .ToListAsync();

        _logger.LogInformation("GetByPlayerIdAsync returned {Count} transactions for player {PlayerId}", results.Count, playerId);
        return results;
    }

    public async Task<IEnumerable<TransactionResponse>> GetPendingAsync()
    {
        var results = await _db.Transactions
            .Where(t => !t.IsApproved)
            .OrderBy(t => t.CreatedAt)
            .Join(_db.Players, t => t.PlayerId, p => p.Id, (t, p) => new { t, p })
            .Select(x => new TransactionResponse(
                x.t.Id,
                x.t.PlayerId,
                x.t.Amount,
                x.t.Type.ToString(),
                x.t.MobilePayTransactionId,
                x.t.IsApproved,
                x.t.CreatedAt,
                x.t.ApprovedAt,
                x.t.ApprovedById,
                !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : x.p.Email))
            .ToListAsync();

        _logger.LogInformation("GetPendingAsync returned {Count} pending transactions", results.Count);
        return results;
    }

    public async Task<IEnumerable<TransactionResponse>> GetAllAsync()
    {
        var results = await _db.Transactions
            .OrderByDescending(t => t.CreatedAt)
            .Join(_db.Players, t => t.PlayerId, p => p.Id, (t, p) => new { t, p })
            .Select(x => new TransactionResponse(
                x.t.Id,
                x.t.PlayerId,
                x.t.Amount,
                x.t.Type.ToString(),
                x.t.MobilePayTransactionId,
                x.t.IsApproved,
                x.t.CreatedAt,
                x.t.ApprovedAt,
                x.t.ApprovedById,
                !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : x.p.Email))
            .ToListAsync();

        _logger.LogInformation("GetAllAsync returned {Count} transactions total", results.Count);
        return results;
    }

    public async Task<TransactionResponse> CreateDepositAsync(CreateDepositRequest request)
    {
        if (request.Amount <= 0)
            throw new ArgumentException("Deposit amount must be positive");
        var trimmedMobilePayId = request.MobilePayTransactionId?.Trim();
        if (string.IsNullOrWhiteSpace(trimmedMobilePayId))
            throw new ArgumentException("MobilePay transaction ID is required");

        var player = await _db.Players.FindAsync(request.PlayerId);
        if (player == null)
            throw new ArgumentException("Player not found");

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = request.PlayerId,
            Amount = request.Amount,
            Type = TransactionType.Deposit,
            MobilePayTransactionId = trimmedMobilePayId,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();

        return new TransactionResponse(
            transaction.Id,
            transaction.PlayerId,
            transaction.Amount,
            transaction.Type.ToString(),
            transaction.MobilePayTransactionId,
            transaction.IsApproved,
            transaction.CreatedAt,
            transaction.ApprovedAt,
            transaction.ApprovedById,
            player?.Name != null && player.Name != "" ? player.Name : player?.Email);
    }

    public async Task<TransactionResponse?> ApproveAsync(Guid id, ApproveTransactionRequest request)
    {
        var transaction = await _db.Transactions.FindAsync(id);
        if (transaction == null) return null;

        transaction.IsApproved = true;
        transaction.ApprovedAt = DateTime.UtcNow;
        transaction.ApprovedById = request.ApprovedById;

        await _db.SaveChangesAsync();

        var player2 = await _db.Players.FindAsync(transaction.PlayerId);
        return new TransactionResponse(
            transaction.Id,
            transaction.PlayerId,
            transaction.Amount,
            transaction.Type.ToString(),
            transaction.MobilePayTransactionId,
            transaction.IsApproved,
            transaction.CreatedAt,
            transaction.ApprovedAt,
            transaction.ApprovedById,
            player2?.Name != null && player2.Name != "" ? player2.Name : player2?.Email);
    }
}
