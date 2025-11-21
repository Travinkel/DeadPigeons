using DeadPigeons.DataAccess.Entities;

namespace DeadPigeons.Api.Services;

public interface IAuthService
{
    Task<Player?> ValidateCredentialsAsync(string email, string password);
    string GenerateJwtToken(Player player);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
