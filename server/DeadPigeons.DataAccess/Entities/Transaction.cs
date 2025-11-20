namespace DeadPigeons.DataAccess.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public string? MobilePayTransactionId { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedById { get; set; }

    // Navigation properties
    public Player Player { get; set; } = null!;
    public Board? Board { get; set; }
}
