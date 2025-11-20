namespace DeadPigeons.DataAccess.Entities;

public class Game
{
    public Guid Id { get; set; }
    public int WeekNumber { get; set; }
    public int Year { get; set; }
    public GameStatus Status { get; set; }
    public int[]? WinningNumbers { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Board> Boards { get; set; } = new List<Board>();
}
