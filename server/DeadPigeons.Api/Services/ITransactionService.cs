using DeadPigeons.Api.Dtos;

namespace DeadPigeons.Api.Services;

public interface ITransactionService
{
    Task<IEnumerable<TransactionResponse>> GetByPlayerIdAsync(Guid playerId);
    Task<IEnumerable<TransactionResponse>> GetPendingAsync();
    Task<TransactionResponse> CreateDepositAsync(CreateDepositRequest request);
    Task<TransactionResponse?> ApproveAsync(Guid id, ApproveTransactionRequest request);
}
