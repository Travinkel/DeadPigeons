using System.Security.Claims;
using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.Api.Responses;
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

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTransactionById(Guid id)
    {
        var transaction = await _transactionService.GetByIdAsync(id);
        if (transaction == null)
        {
            return StatusCode(404, new ErrorResponse("TX_NOT_FOUND", "Transaction not found", CorrelationId));
        }
        return Ok(transaction);
    }

    [HttpGet("player/{playerId:guid}")]
    public async Task<IActionResult> GetByPlayerId(Guid playerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && userId != playerId.ToString())
            return StatusCode(403, new ErrorResponse("AUTH_FORBIDDEN", "Cannot view transactions for another user", CorrelationId));

        var transactions = await _transactionService.GetByPlayerIdAsync(playerId);
        return Ok(transactions);
    }

    [HttpGet("pending")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> GetPending()
    {
        var transactions = await _transactionService.GetPendingAsync();
        return Ok(transactions);
    }

    [HttpGet("admin")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _transactionService.GetAllAsync();
        return Ok(transactions);
    }

    [HttpPost("deposit")]
    [Authorize(Policy = "RequirePlayer")]
    public async Task<IActionResult> CreateDeposit([FromBody] CreateDepositRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorResponse("VALIDATION_FAILED", "Invalid request body", CorrelationId));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (isAdmin)
        {
            return StatusCode(403, new ErrorResponse("AUTH_FORBIDDEN", "Admins cannot create deposits", CorrelationId));
        }

        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var currentUserId))
        {
            return Unauthorized(new ErrorResponse("AUTH_UNAUTHORIZED", "Missing or invalid user id in token", CorrelationId));
        }

        if (currentUserId != request.PlayerId)
        {
            return StatusCode(403, new ErrorResponse("AUTH_FORBIDDEN", "Cannot create deposit for another user", CorrelationId));
        }

        try
        {
            var transaction = await _transactionService.CreateDepositAsync(request);
            return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ErrorResponse("DEPOSIT_INVALID", ex.Message, CorrelationId));
        }
        catch (Exception)
        {
            return StatusCode(500, new ErrorResponse("DEPOSIT_ERROR", "Unexpected error creating deposit", CorrelationId));
        }
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var approvedById))
        {
            return Unauthorized(new ErrorResponse("AUTH_UNAUTHORIZED", "Missing or invalid user id in token", CorrelationId));
        }

        try
        {
            var transaction = await _transactionService.ApproveAsync(id, approvedById);
            if (transaction == null)
            {
                return StatusCode(404, new ErrorResponse("TX_NOT_FOUND", "Transaction not found", CorrelationId));
            }
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ErrorResponse("TX_INVALID_STATE", ex.Message, CorrelationId));
        }
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId) || !Guid.TryParse(userId, out var rejectedById))
        {
            return Unauthorized(new ErrorResponse("AUTH_UNAUTHORIZED", "Missing or invalid user id in token", CorrelationId));
        }

        try
        {
            var transaction = await _transactionService.RejectAsync(id, rejectedById);
            if (transaction == null)
            {
                return StatusCode(404, new ErrorResponse("TX_NOT_FOUND", "Transaction not found", CorrelationId));
            }
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ErrorResponse("TX_INVALID_STATE", ex.Message, CorrelationId));
        }
    }
}
