using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly AppDbContext _db;

    public PlayersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlayers()
    {
        var players = await _db.Players.ToListAsync();
        return Ok(players);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlayer([FromBody] CreatePlayerDto dto)
    {
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlayers), new { id = player.Id }, player);
    }
}

public record CreatePlayerDto(string Name, string Email);
