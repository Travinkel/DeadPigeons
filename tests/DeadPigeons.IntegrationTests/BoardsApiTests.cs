using System.Net;
using System.Net.Http.Json;
using DeadPigeons.Api.Dtos;
using FluentAssertions;

namespace DeadPigeons.IntegrationTests;

[Collection("IntegrationTests")]
public class BoardsApiTests
{
    private readonly HttpClient _client;

    public BoardsApiTests(ApiFactory factory)
    {
        _client = factory.CreateAuthenticatedClient("Admin");
    }

    private async Task<PlayerResponse> CreatePlayerWithBalance(decimal amount)
    {
        // Create player
        var playerRequest = new CreatePlayerRequest("Board Test", $"board{Guid.NewGuid()}@example.com", null);
        var playerResponse = await _client.PostAsJsonAsync("/api/players", playerRequest);
        var player = await playerResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        // Create and approve deposit
        var depositRequest = new CreateDepositRequest(player!.Id, amount, null);
        var depositResponse = await _client.PostAsJsonAsync("/api/transactions/deposit", depositRequest);
        var transaction = await depositResponse.Content.ReadFromJsonAsync<TransactionResponse>();
        await _client.PostAsJsonAsync($"/api/transactions/{transaction!.Id}/approve", new ApproveTransactionRequest(Guid.NewGuid()));

        return player;
    }

    private async Task<GameResponse> CreateActiveGame()
    {
        // Complete any existing active game first (seeder creates one)
        var activeResponse = await _client.GetAsync("/api/games/active");
        if (activeResponse.IsSuccessStatusCode)
        {
            var activeGame = await activeResponse.Content.ReadFromJsonAsync<GameResponse>();
            if (activeGame != null)
            {
                await _client.PostAsJsonAsync(
                    $"/api/games/{activeGame.Id}/complete",
                    new CompleteGameRequest(new[] { 1, 2, 3 }));
            }
        }

        // Use GUID-based unique values within allowed DTO range (Year 2020-2100)
        // Keep year > seeder range (2044) but <= 2100
        var hash = Math.Abs(Guid.NewGuid().GetHashCode());
        var weekNumber = (hash % 52) + 1;
        var year = 2050 + (hash % 50); // 2050-2099
        var request = new CreateGameRequest(weekNumber, year);
        var response = await _client.PostAsJsonAsync("/api/games", request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<GameResponse>())!;
    }

    [Fact]
    public async Task Create_ReturnsCreatedBoard()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(100m);
        var game = await CreateActiveGame();

        var numbers = new int[] { 1, 2, 3, 4, 5 };
        var request = new CreateBoardRequest(player.Id, game.Id, numbers, false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/boards", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var board = await response.Content.ReadFromJsonAsync<BoardResponse>();
        board.Should().NotBeNull();
        board!.PlayerId.Should().Be(player.Id);
        board.GameId.Should().Be(game.Id);
        board.Numbers.Should().BeEquivalentTo(numbers);
        board.IsRepeating.Should().BeFalse();
    }

    [Fact]
    public async Task Create_DeductsBalance()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(100m);
        var game = await CreateActiveGame();

        // 5 numbers = 25 DKK
        var request = new CreateBoardRequest(player.Id, game.Id, new int[] { 1, 2, 3, 4, 5 }, false);

        // Act
        await _client.PostAsJsonAsync("/api/boards", request);

        // Assert
        var balanceResponse = await _client.GetAsync($"/api/players/{player.Id}/balance");
        var balance = await balanceResponse.Content.ReadFromJsonAsync<PlayerBalanceResponse>();
        balance!.Balance.Should().Be(75m); // 100 - 25
    }

    [Fact]
    public async Task Create_WithInsufficientBalance_ReturnsBadRequest()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(10m); // Only 10 DKK
        var game = await CreateActiveGame();

        // 5 numbers = 25 DKK (more than balance)
        var request = new CreateBoardRequest(player.Id, game.Id, new int[] { 1, 2, 3, 4, 5 }, false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/boards", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Create_WithTooFewNumbers_ReturnsBadRequest()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(100m);
        var game = await CreateActiveGame();

        var request = new CreateBoardRequest(player.Id, game.Id, new int[] { 1, 2, 3, 4 }, false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/boards", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Create_WithTooManyNumbers_ReturnsBadRequest()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(100m);
        var game = await CreateActiveGame();

        var request = new CreateBoardRequest(player.Id, game.Id, new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 }, false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/boards", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetByGameId_ReturnsGameBoards()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(100m);
        var game = await CreateActiveGame();

        await _client.PostAsJsonAsync("/api/boards", new CreateBoardRequest(player.Id, game.Id, new int[] { 1, 2, 3, 4, 5 }, false));

        // Act
        var response = await _client.GetAsync($"/api/boards/game/{game.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var boards = await response.Content.ReadFromJsonAsync<List<BoardResponse>>();
        boards.Should().NotBeNull();
        boards!.Should().OnlyContain(b => b.GameId == game.Id);
    }

    [Fact]
    public async Task GetByPlayerId_ReturnsPlayerBoards()
    {
        // Arrange
        var player = await CreatePlayerWithBalance(100m);
        var game = await CreateActiveGame();

        await _client.PostAsJsonAsync("/api/boards", new CreateBoardRequest(player.Id, game.Id, new int[] { 1, 2, 3, 4, 5 }, false));

        // Act
        var response = await _client.GetAsync($"/api/boards/player/{player.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var boards = await response.Content.ReadFromJsonAsync<List<BoardResponse>>();
        boards.Should().NotBeNull();
        boards!.Should().OnlyContain(b => b.PlayerId == player.Id);
    }
}
