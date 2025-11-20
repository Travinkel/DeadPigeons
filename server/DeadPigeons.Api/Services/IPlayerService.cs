using DeadPigeons.Api.Dtos;

namespace DeadPigeons.Api.Services;

public interface IPlayerService
{
    Task<IEnumerable<PlayerResponse>> GetAllAsync();
    Task<PlayerResponse?> GetByIdAsync(Guid id);
    Task<PlayerResponse> CreateAsync(CreatePlayerRequest request);
    Task<PlayerResponse?> UpdateAsync(Guid id, UpdatePlayerRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<decimal> GetBalanceAsync(Guid playerId);
}
