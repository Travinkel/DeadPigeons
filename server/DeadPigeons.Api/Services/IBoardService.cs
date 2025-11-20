using DeadPigeons.Api.Dtos;

namespace DeadPigeons.Api.Services;

public interface IBoardService
{
    Task<IEnumerable<BoardResponse>> GetByGameIdAsync(Guid gameId);
    Task<IEnumerable<BoardResponse>> GetByPlayerIdAsync(Guid playerId);
    Task<BoardResponse?> GetByIdAsync(Guid id);
    Task<BoardResponse> CreateAsync(CreateBoardRequest request);
}
