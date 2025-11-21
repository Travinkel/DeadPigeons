using System.ComponentModel.DataAnnotations;

namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreateDepositRequest(
    [Required] Guid PlayerId,
    [Required, Range(0.01, 10000)] decimal Amount,
    [StringLength(50)] string? MobilePayTransactionId
);

public record ApproveTransactionRequest(
    [Required] Guid ApprovedById
);

// Response DTOs
public record TransactionResponse(
    Guid Id,
    Guid PlayerId,
    decimal Amount,
    string Type,
    string? MobilePayTransactionId,
    bool IsApproved,
    DateTime CreatedAt,
    DateTime? ApprovedAt,
    Guid? ApprovedById
);
