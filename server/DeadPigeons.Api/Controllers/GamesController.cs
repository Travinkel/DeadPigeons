using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeadPigeons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService)
    {
        _gameService = gameService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameResponse>>> GetAll()
    {
        var games = await _gameService.GetAllAsync();
        return Ok(games);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GameResponse>> GetById(Guid id)
    {
        var game = await _gameService.GetByIdAsync(id);
        if (game == null) return NotFound();
        return Ok(game);
    }

    [HttpGet("active")]
    public async Task<ActionResult<GameResponse>> GetActive()
    {
        var game = await _gameService.GetActiveAsync();
        if (game == null) return NotFound();
        return Ok(game);
    }

    [HttpPost]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<GameResponse>> Create([FromBody] CreateGameRequest request)
    {
        try
        {
            var game = await _gameService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = game.Id }, game);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id:guid}/complete")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<GameResultResponse>> Complete(Guid id, [FromBody] CompleteGameRequest request)
    {
        try
        {
            var result = await _gameService.CompleteAsync(id, request);
            if (result == null) return NotFound();
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
