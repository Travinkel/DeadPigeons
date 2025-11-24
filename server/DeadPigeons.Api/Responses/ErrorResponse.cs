namespace DeadPigeons.Api.Responses;

public record ErrorResponse(string Code, string Message, string CorrelationId);
