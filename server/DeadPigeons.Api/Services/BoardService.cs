using DeadPigeons.Api.Dtos;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeadPigeons.Api.Services;

public class BoardService : IBoardService
{
    private readonly AppDbContext _db;
    private readonly IPlayerService _playerService;
    private readonly ILogger<BoardService> _logger;

    public BoardService(AppDbContext db, IPlayerService playerService, ILogger<BoardService> logger)
    {
        _db = db;
        _playerService = playerService;
        _logger = logger;
    }

    private static decimal CalculatePrice(int count) =>
        count switch
        {
            5 => 20m,
            6 => 40m,
            7 => 80m,
            8 => 160m,
            _ => throw new ArgumentException("Board must have 5-8 numbers")
        };

    public async Task<IEnumerable<BoardResponse>> GetByGameIdAsync(Guid gameId)
    {
        return await (
            from b in _db.Boards
            join g in _db.Games on b.GameId equals g.Id
            where b.GameId == gameId
            select new BoardResponse(
                b.Id,
                b.PlayerId,
                b.GameId,
                b.Numbers,
                b.IsRepeating,
                b.CreatedAt,
                b.TransactionId,
                g.WeekNumber,
                g.Year,
                $"Uge {g.WeekNumber}, {g.Year}")
        ).ToListAsync();
    }

    public async Task<IEnumerable<BoardResponse>> GetByPlayerIdAsync(Guid playerId)
    {
        return await (
            from b in _db.Boards
            join g in _db.Games on b.GameId equals g.Id
            where b.PlayerId == playerId
            orderby b.CreatedAt descending
            select new BoardResponse(
                b.Id,
                b.PlayerId,
                b.GameId,
                b.Numbers,
                b.IsRepeating,
                b.CreatedAt,
                b.TransactionId,
                g.WeekNumber,
                g.Year,
                $"Uge {g.WeekNumber}, {g.Year}")
        ).ToListAsync();
    }

    public async Task<BoardResponse?> GetByIdAsync(Guid id)
    {
        var board = await _db.Boards.FindAsync(id);
        if (board == null) return null;

        var g = await _db.Games.FindAsync(board.GameId);
        var wk = g?.WeekNumber ?? 0;
        var yr = g?.Year ?? 0;
        return new BoardResponse(
            board.Id,
            board.PlayerId,
            board.GameId,
            board.Numbers,
            board.IsRepeating,
            board.CreatedAt,
            board.TransactionId,
            wk,
            yr,
            $"Uge {wk}, {yr}");
    }

    public async Task<BoardResponse> CreateAsync(CreateBoardRequest request)
    {
        // Validate number count (5-8)
        if (request.Numbers.Length < 5 || request.Numbers.Length > 8)
            throw new ArgumentException("Board must have 5-8 numbers");

        // Validate numbers are unique
        if (request.Numbers.Distinct().Count() != request.Numbers.Length)
            throw new ArgumentException("Numbers must be unique");

        // Validate number range (1-90)
        if (request.Numbers.Any(n => n < 1 || n > 90))
            throw new ArgumentException("Numbers must be between 1 and 90");

        // Validate game is active
        var game = await _db.Games.FindAsync(request.GameId);
        if (game == null)
        {
            _logger.LogWarning("Board create failed: game {GameId} not found", request.GameId);
            throw new ArgumentException("Game not found");
        }
        if (game.Status != GameStatus.Active)
        {
            _logger.LogWarning("Board create failed: game {GameId} is not active (status {Status})", request.GameId, game.Status);
            throw new ArgumentException("Game is not active");
        }

        // Calculate cost
        var cost = CalculatePrice(request.Numbers.Length);

        // Check player balance
        var balance = await _playerService.GetBalanceAsync(request.PlayerId);
        if (balance < cost)
            throw new InvalidOperationException("Insufficient balance");

        // Require MobilePay transaction id
        if (string.IsNullOrWhiteSpace(request.MobilePayTransactionId))
            throw new ArgumentException("MobilePay transaction ID is required");

        var trimmedMobilePayId = request.MobilePayTransactionId.Trim();

        // Create purchase transaction
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = request.PlayerId,
            Amount = -cost, // Negative for purchase
            Type = TransactionType.Purchase,
            MobilePayTransactionId = trimmedMobilePayId,
            IsApproved = true, // Auto-approved for purchases
            CreatedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow
        };

        // Create board
        var board = new Board
        {
            Id = Guid.NewGuid(),
            PlayerId = request.PlayerId,
            GameId = request.GameId,
            Numbers = request.Numbers,
            IsRepeating = request.IsRepeating,
            CreatedAt = DateTime.UtcNow,
            TransactionId = transaction.Id
        };

        _db.Transactions.Add(transaction);
        _db.Boards.Add(board);
        await _db.SaveChangesAsync();

        return new BoardResponse(
            board.Id,
            board.PlayerId,
            board.GameId,
            board.Numbers,
            board.IsRepeating,
            board.CreatedAt,
            board.TransactionId,
            game.WeekNumber,
            game.Year,
            $"Uge {game.WeekNumber}, {game.Year}");
    }
}
