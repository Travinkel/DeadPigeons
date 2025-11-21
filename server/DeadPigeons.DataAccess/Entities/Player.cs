namespace DeadPigeons.DataAccess.Entities;

public class Player
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;  // Required per exam spec
    public bool IsActive { get; set; } = false;  // Inactive by default per exam spec
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }

    // Identity fields
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; } = Role.Player;
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Board> Boards { get; set; } = new List<Board>();
}
