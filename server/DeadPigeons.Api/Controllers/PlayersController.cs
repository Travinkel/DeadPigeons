using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeadPigeons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlayersController : ControllerBase
{
    private readonly IPlayerService _playerService;

    public PlayersController(IPlayerService playerService)
    {
        _playerService = playerService;
    }

    [HttpGet]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<IEnumerable<PlayerResponse>>> GetAll()
    {
        var players = await _playerService.GetAllAsync();
        return Ok(players);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PlayerResponse>> GetById(Guid id)
    {
        var player = await _playerService.GetByIdAsync(id);
        if (player == null) return NotFound();
        return Ok(player);
    }

    [HttpPost]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<PlayerResponse>> Create([FromBody] CreatePlayerRequest request)
    {
        var player = await _playerService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = player.Id }, player);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PlayerResponse>> Update(Guid id, [FromBody] UpdatePlayerRequest request)
    {
        var player = await _playerService.UpdateAsync(id, request);
        if (player == null) return NotFound();
        return Ok(player);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _playerService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("{id:guid}/balance")]
    public async Task<ActionResult<PlayerBalanceResponse>> GetBalance(Guid id)
    {
        var player = await _playerService.GetByIdAsync(id);
        if (player == null) return NotFound();

        var balance = await _playerService.GetBalanceAsync(id);
        return Ok(new PlayerBalanceResponse(id, balance));
    }
}
