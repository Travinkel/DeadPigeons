namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreateBoardRequest(
    Guid PlayerId,
    Guid GameId,
    int[] Numbers,
    bool IsRepeating
);

// Response DTOs
public record BoardResponse(
    Guid Id,
    Guid PlayerId,
    Guid GameId,
    int[] Numbers,
    bool IsRepeating,
    DateTime CreatedAt,
    Guid TransactionId
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
