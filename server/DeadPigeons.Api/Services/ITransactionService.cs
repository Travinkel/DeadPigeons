using DeadPigeons.Api.Dtos;

namespace DeadPigeons.Api.Services;

public interface ITransactionService
{
    Task<TransactionResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<TransactionResponse>> GetByPlayerIdAsync(Guid playerId);
    Task<IEnumerable<TransactionResponse>> GetPendingAsync();
    Task<IEnumerable<TransactionResponse>> GetAllAsync();
    Task<TransactionResponse> CreateDepositAsync(CreateDepositRequest request);
    Task<TransactionResponse?> ApproveAsync(Guid id, ApproveTransactionRequest request);
    Task<TransactionResponse?> RejectAsync(Guid id, Guid rejectedById);
}
