using DeadPigeons.Api.Dtos;

namespace DeadPigeons.Api.Services;

public interface IGameService
{
    Task<IEnumerable<GameResponse>> GetAllAsync();
    Task<GameResponse?> GetByIdAsync(Guid id);
    Task<GameResponse?> GetActiveAsync();
    Task<GameResponse> CreateAsync(CreateGameRequest request);
    Task<GameResultResponse?> CompleteAsync(Guid id, CompleteGameRequest request);
}
