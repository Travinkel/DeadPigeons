using DeadPigeons.Api.Dtos;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _db;

    public TransactionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TransactionResponse>> GetByPlayerIdAsync(Guid playerId)
    {
        return await (
            from t in _db.Transactions
            where t.PlayerId == playerId
            orderby t.CreatedAt descending
            join p in _db.Players on t.PlayerId equals p.Id into gp
            from p in gp.DefaultIfEmpty()
            select new TransactionResponse(
                t.Id,
                t.PlayerId,
                t.Amount,
                t.Type.ToString(),
                t.MobilePayTransactionId,
                t.IsApproved,
                t.CreatedAt,
                t.ApprovedAt,
                t.ApprovedById,
                p != null && !string.IsNullOrEmpty(p.Name) ? p.Name : p != null ? p.Email : null)
        ).ToListAsync();
    }

    public async Task<IEnumerable<TransactionResponse>> GetPendingAsync()
    {
        return await (
            from t in _db.Transactions
            where !t.IsApproved
            orderby t.CreatedAt
            join p in _db.Players on t.PlayerId equals p.Id into gp
            from p in gp.DefaultIfEmpty()
            select new TransactionResponse(
                t.Id,
                t.PlayerId,
                t.Amount,
                t.Type.ToString(),
                t.MobilePayTransactionId,
                t.IsApproved,
                t.CreatedAt,
                t.ApprovedAt,
                t.ApprovedById,
                p != null && !string.IsNullOrEmpty(p.Name) ? p.Name : p != null ? p.Email : null)
        ).ToListAsync();
    }

    public async Task<TransactionResponse> CreateDepositAsync(CreateDepositRequest request)
    {
        if (request.Amount <= 0)
            throw new ArgumentException("Deposit amount must be positive");
        if (string.IsNullOrWhiteSpace(request.MobilePayTransactionId))
            throw new ArgumentException("MobilePay transaction ID is required");

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = request.PlayerId,
            Amount = request.Amount,
            Type = TransactionType.Deposit,
            MobilePayTransactionId = request.MobilePayTransactionId,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();

        var player = await _db.Players.FindAsync(transaction.PlayerId);
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
