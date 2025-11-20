using DeadPigeons.Api.Dtos;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Services;

public class PlayerService : IPlayerService
{
    private readonly AppDbContext _db;

    public PlayerService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<PlayerResponse>> GetAllAsync()
    {
        return await _db.Players
            .Select(p => new PlayerResponse(
                p.Id,
                p.Name,
                p.Email,
                p.Phone,
                p.IsActive,
                p.CreatedAt,
                p.UpdatedAt))
            .ToListAsync();
    }

    public async Task<PlayerResponse?> GetByIdAsync(Guid id)
    {
        // Use FirstOrDefaultAsync to apply query filter (soft delete)
        var player = await _db.Players.FirstOrDefaultAsync(p => p.Id == id);
        if (player == null) return null;

        return new PlayerResponse(
            player.Id,
            player.Name,
            player.Email,
            player.Phone,
            player.IsActive,
            player.CreatedAt,
            player.UpdatedAt);
    }

    public async Task<PlayerResponse> CreateAsync(CreatePlayerRequest request)
    {
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone ?? string.Empty,
            IsActive = false,  // Inactive by default per exam spec
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        return new PlayerResponse(
            player.Id,
            player.Name,
            player.Email,
            player.Phone,
            player.IsActive,
            player.CreatedAt,
            player.UpdatedAt);
    }

    public async Task<PlayerResponse?> UpdateAsync(Guid id, UpdatePlayerRequest request)
    {
        var player = await _db.Players.FindAsync(id);
        if (player == null) return null;

        player.Name = request.Name;
        player.Email = request.Email;
        player.Phone = request.Phone ?? string.Empty;
        player.IsActive = request.IsActive;

        await _db.SaveChangesAsync();

        return new PlayerResponse(
            player.Id,
            player.Name,
            player.Email,
            player.Phone,
            player.IsActive,
            player.CreatedAt,
            player.UpdatedAt);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var player = await _db.Players.FindAsync(id);
        if (player == null) return false;

        // Soft delete
        player.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<decimal> GetBalanceAsync(Guid playerId)
    {
        return await _db.Transactions
            .Where(t => t.PlayerId == playerId && t.IsApproved)
            .SumAsync(t => t.Amount);
    }
}
