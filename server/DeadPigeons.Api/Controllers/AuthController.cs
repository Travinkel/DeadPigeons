using DeadPigeons.Api.Dtos;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly AppDbContext _context;

    public AuthController(IAuthService authService, AppDbContext context)
    {
        _authService = authService;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var player = await _authService.ValidateCredentialsAsync(request.Email, request.Password);

        if (player == null)
            return Unauthorized(new { message = "Invalid email or password" });

        if (!player.IsActive)
            return Unauthorized(new { message = "Account is not active" });

        var token = _authService.GenerateJwtToken(player);

        return Ok(new LoginResponse(
            token,
            player.Id,
            player.Email,
            player.Role.ToString()
        ));
    }

    /// <summary>
    /// DEV ONLY: Reset all players for testing
    /// </summary>
    [HttpDelete("dev-reset")]
    public async Task<ActionResult> DevReset()
    {
        if (!Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Development", StringComparison.OrdinalIgnoreCase) ?? true)
            return NotFound();

        _context.Players.RemoveRange(_context.Players);
        await _context.SaveChangesAsync();
        return Ok(new { message = "All players deleted" });
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        // Check if email already exists (case-insensitive)
        if (await _context.Players.AnyAsync(p => p.Email.ToLower() == request.Email.ToLower()))
            return Conflict(new { message = "Email already registered" });

        // First user becomes active admin (bootstrap)
        var isFirstUser = !await _context.Players.AnyAsync();

        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email.ToLower(), // Normalize email
            Phone = request.Phone,
            PasswordHash = _authService.HashPassword(request.Password),
            Role = isFirstUser ? Role.Admin : Role.Player,
            IsActive = isFirstUser, // First user is active, others need admin activation
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        return Created(string.Empty, new RegisterResponse(
            player.Id,
            player.Email,
            "Registration successful. Account pending admin activation."
        ));
    }
}
