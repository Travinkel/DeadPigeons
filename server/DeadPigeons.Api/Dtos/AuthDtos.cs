using System.ComponentModel.DataAnnotations;

namespace DeadPigeons.Api.Dtos;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password
);

public record LoginResponse(string Token, Guid PlayerId, string Email, string Role);

public record RegisterRequest(
    [Required, StringLength(100, MinimumLength = 2)] string Name,
    [Required, EmailAddress] string Email,
    [Required, StringLength(20)] string Phone,
    [Required, MinLength(6)] string Password
);

public record RegisterResponse(Guid PlayerId, string Email, string Message);
