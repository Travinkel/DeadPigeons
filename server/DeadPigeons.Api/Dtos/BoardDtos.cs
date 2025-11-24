using System.ComponentModel.DataAnnotations;

namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreateBoardRequest(
    [Required] Guid PlayerId,
    [Required] Guid GameId,
    [Required, MinLength(5), MaxLength(8)] int[] Numbers,
    bool IsRepeating,
    [Required, StringLength(50)] string MobilePayTransactionId
);

// Response DTOs
public record BoardResponse(
    Guid Id,
    Guid PlayerId,
    Guid GameId,
    int[] Numbers,
    bool IsRepeating,
    DateTime CreatedAt,
    Guid TransactionId,
    int WeekNumber,
    int Year,
    string FriendlyTitle
);

public record BoardWithPlayerResponse(
    Guid Id,
    Guid PlayerId,
    string PlayerName,
    Guid GameId,
    int[] Numbers,
    bool IsRepeating,
    DateTime CreatedAt
);
