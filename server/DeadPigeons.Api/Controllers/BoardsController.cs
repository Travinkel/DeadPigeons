using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeadPigeons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardsController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardsController(IBoardService boardService)
    {
        _boardService = boardService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BoardResponse>> GetById(Guid id)
    {
        var board = await _boardService.GetByIdAsync(id);
        if (board == null) return NotFound();
        return Ok(board);
    }

    [HttpGet("game/{gameId:guid}")]
    public async Task<ActionResult<IEnumerable<BoardResponse>>> GetByGameId(Guid gameId)
    {
        var boards = await _boardService.GetByGameIdAsync(gameId);
        return Ok(boards);
    }

    [HttpGet("player/{playerId:guid}")]
    public async Task<ActionResult<IEnumerable<BoardResponse>>> GetByPlayerId(Guid playerId)
    {
        var boards = await _boardService.GetByPlayerIdAsync(playerId);
        return Ok(boards);
    }

    [HttpPost]
    public async Task<ActionResult<BoardResponse>> Create([FromBody] CreateBoardRequest request)
    {
        try
        {
            var board = await _boardService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
