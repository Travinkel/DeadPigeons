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
public class BoardsController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardsController(IBoardService boardService)
    {
        _boardService = boardService;
    }

    private string CorrelationId => HttpContext.Items.TryGetValue("X-Correlation-ID", out var id) ? id?.ToString() ?? string.Empty : string.Empty;

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var board = await _boardService.GetByIdAsync(id);
        if (board == null)
        {
            return StatusCode(404, new ErrorResponse("BOARD_NOT_FOUND", "Board not found", CorrelationId));
        }
        return Ok(board);
    }

    [HttpGet("game/{gameId:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<IEnumerable<BoardResponse>>> GetByGameId(Guid gameId)
    {
        var boards = await _boardService.GetByGameIdAsync(gameId);
        return Ok(boards);
    }

    [HttpGet("player/{playerId:guid}")]
    public async Task<ActionResult<IEnumerable<BoardResponse>>> GetByPlayerId(Guid playerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && userId != playerId.ToString())
            return StatusCode(403, new ErrorResponse("AUTH_FORBIDDEN", "Cannot view boards for another user", CorrelationId));

        var boards = await _boardService.GetByPlayerIdAsync(playerId);
        return Ok(boards);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBoardRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && userId != request.PlayerId.ToString())
            return StatusCode(403, new ErrorResponse("AUTH_FORBIDDEN", "Cannot create board for another user", CorrelationId));

        try
        {
            var board = await _boardService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ErrorResponse("BOARD_INVALID", ex.Message, CorrelationId));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ErrorResponse("BOARD_INVALID", ex.Message, CorrelationId));
        }
        catch (Exception)
        {
            return StatusCode(500, new ErrorResponse("BOARD_ERROR", "Unexpected error creating board", CorrelationId));
        }
    }
}
