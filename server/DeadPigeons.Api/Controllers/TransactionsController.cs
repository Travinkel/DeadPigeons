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

    [HttpPost("deposit")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<TransactionResponse>> CreateDeposit([FromBody] CreateDepositRequest request)
    {
        try
        {
            var transaction = await _transactionService.CreateDepositAsync(request);
            return CreatedAtAction(nameof(GetByPlayerId), new { playerId = transaction.PlayerId }, transaction);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
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
