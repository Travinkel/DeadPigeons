using System.ComponentModel.DataAnnotations;

namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreateGameRequest(
    [Required, Range(1, 53)] int WeekNumber,
    [Required, Range(2020, 2100)] int Year
);

public record CompleteGameRequest(
    [Required, MinLength(3), MaxLength(3)] int[] WinningNumbers
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
