using System.ComponentModel.DataAnnotations;

namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreatePlayerRequest(
    [Required, StringLength(100, MinimumLength = 2)] string Name,
    [Required, EmailAddress] string Email,
    [StringLength(20)] string? Phone
);

public record UpdatePlayerRequest(
    [Required, StringLength(100, MinimumLength = 2)] string Name,
    [Required, EmailAddress] string Email,
    [StringLength(20)] string? Phone,
    bool IsActive
);

// Response DTOs
public record PlayerResponse(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PlayerBalanceResponse(
    Guid PlayerId,
    decimal Balance
);

public record PlayerWithBalanceResponse(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    bool IsActive,
    decimal Balance,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
