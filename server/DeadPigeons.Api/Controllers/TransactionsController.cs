using System.Security.Claims;
using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeadPigeons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    private string CorrelationId => HttpContext.Items.TryGetValue("X-Correlation-ID", out var id) ? id?.ToString() ?? string.Empty : string.Empty;

    [HttpGet("player/{playerId:guid}")]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetByPlayerId(Guid playerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && userId != playerId.ToString())
            return Forbid();

        var transactions = await _transactionService.GetByPlayerIdAsync(playerId);
        return Ok(transactions);
    }

    [HttpGet("pending")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetPending()
    {
        var transactions = await _transactionService.GetPendingAsync();
        return Ok(transactions);
    }

    [HttpGet("admin")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAll()
    {
        var transactions = await _transactionService.GetAllAsync();
        return Ok(transactions);
    }

    [HttpPost("deposit")]
    [Authorize(Policy = "RequirePlayer")]
    public async Task<ActionResult<TransactionResponse>> CreateDeposit([FromBody] CreateDepositRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (isAdmin)
        {
            return Forbid(new Responses.ErrorResponse("AUTH_FORBIDDEN", "Admins cannot create deposits", CorrelationId));
        }

        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var currentUserId))
        {
            return Unauthorized(new Responses.ErrorResponse("AUTH_UNAUTHORIZED", "Missing or invalid user id in token", CorrelationId));
        }

        if (currentUserId != request.PlayerId)
        {
            return Forbid(new Responses.ErrorResponse("AUTH_FORBIDDEN", "Cannot create deposit for another user", CorrelationId));
        }

        try
        {
            var transaction = await _transactionService.CreateDepositAsync(request);
            return CreatedAtAction(nameof(GetByPlayerId), new { playerId = transaction.PlayerId }, transaction);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new Responses.ErrorResponse("DEPOSIT_INVALID", ex.Message, CorrelationId));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new Responses.ErrorResponse("DEPOSIT_ERROR", "Unexpected error creating deposit", CorrelationId));
        }
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<TransactionResponse>> Approve(Guid id, [FromBody] ApproveTransactionRequest request)
    {
        var transaction = await _transactionService.ApproveAsync(id, request);
        if (transaction == null) return NotFound();
        return Ok(transaction);
    }
}
