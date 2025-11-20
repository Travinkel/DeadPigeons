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
        return await _db.Transactions
            .Where(t => t.PlayerId == playerId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionResponse(
                t.Id,
                t.PlayerId,
                t.Amount,
                t.Type.ToString(),
                t.MobilePayTransactionId,
                t.IsApproved,
                t.CreatedAt,
                t.ApprovedAt,
                t.ApprovedById))
            .ToListAsync();
    }

    public async Task<IEnumerable<TransactionResponse>> GetPendingAsync()
    {
        return await _db.Transactions
            .Where(t => !t.IsApproved)
            .OrderBy(t => t.CreatedAt)
            .Select(t => new TransactionResponse(
                t.Id,
                t.PlayerId,
                t.Amount,
                t.Type.ToString(),
                t.MobilePayTransactionId,
                t.IsApproved,
                t.CreatedAt,
                t.ApprovedAt,
                t.ApprovedById))
            .ToListAsync();
    }

    public async Task<TransactionResponse> CreateDepositAsync(CreateDepositRequest request)
    {
        if (request.Amount <= 0)
            throw new ArgumentException("Deposit amount must be positive");

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

        return new TransactionResponse(
            transaction.Id,
            transaction.PlayerId,
            transaction.Amount,
            transaction.Type.ToString(),
            transaction.MobilePayTransactionId,
            transaction.IsApproved,
            transaction.CreatedAt,
            transaction.ApprovedAt,
            transaction.ApprovedById);
    }

    public async Task<TransactionResponse?> ApproveAsync(Guid id, ApproveTransactionRequest request)
    {
        var transaction = await _db.Transactions.FindAsync(id);
        if (transaction == null) return null;

        transaction.IsApproved = true;
        transaction.ApprovedAt = DateTime.UtcNow;
        transaction.ApprovedById = request.ApprovedById;

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
            transaction.ApprovedById);
    }
}
