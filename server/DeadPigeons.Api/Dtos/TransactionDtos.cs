namespace DeadPigeons.Api.Dtos;

// Request DTOs
public record CreateDepositRequest(
    Guid PlayerId,
    decimal Amount,
    string? MobilePayTransactionId
);

public record ApproveTransactionRequest(
    Guid ApprovedById
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
