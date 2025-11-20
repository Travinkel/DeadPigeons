namespace DeadPigeons.DataAccess.Entities;

public class Board
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public int[] Numbers { get; set; } = Array.Empty<int>();
    public bool IsRepeating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid TransactionId { get; set; }

    // Navigation properties
    public Player Player { get; set; } = null!;
    public Game Game { get; set; } = null!;
    public Transaction Transaction { get; set; } = null!;
}
