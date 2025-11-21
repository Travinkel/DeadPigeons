using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DeadPigeons.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<Player> _passwordHasher;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<Player>();
    }

    public async Task<Player?> ValidateCredentialsAsync(string email, string password)
    {
        var player = await _context.Players
            .FirstOrDefaultAsync(p => p.Email == email);

        if (player == null)
            return null;

        var result = _passwordHasher.VerifyHashedPassword(player, player.PasswordHash, password);

        if (result == PasswordVerificationResult.Failed)
            return null;

        // Update last login
        player.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return player;
    }

    public string GenerateJwtToken(Player player)
    {
        var secret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT Secret not configured");
        var issuer = _configuration["Jwt:Issuer"] ?? "DeadPigeons";
        var audience = _configuration["Jwt:Audience"] ?? "DeadPigeons";
        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, player.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, player.Email),
            new Claim(ClaimTypes.Role, player.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(null!, password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        var result = _passwordHasher.VerifyHashedPassword(null!, passwordHash, password);
        return result != PasswordVerificationResult.Failed;
    }
}
