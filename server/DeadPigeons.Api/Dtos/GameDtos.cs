namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreateGameRequest(
    int WeekNumber,
    int Year
);

public record CompleteGameRequest(
    int[] WinningNumbers
);

// Response DTOs
public record GameResponse(
    Guid Id,
    int WeekNumber,
    int Year,
    string Status,
    int[]? WinningNumbers,
    DateTime StartedAt,
    DateTime? CompletedAt,
    DateTime CreatedAt,
    int BoardCount
);

public record GameResultResponse(
    Guid GameId,
    int[] WinningNumbers,
    int TotalBoards,
    int WinningBoards,
    IEnumerable<BoardWithPlayerResponse> Winners
);
