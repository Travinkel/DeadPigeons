using System.Net;
using System.Net.Http.Json;
using DeadPigeons.Api.Dtos;
using FluentAssertions;

namespace DeadPigeons.IntegrationTests;

[Collection("IntegrationTests")]
public class GamesApiTests
{
    private readonly HttpClient _client;

    public GamesApiTests(ApiFactory factory)
    {
        _client = factory.CreateAuthenticatedClient("Admin");
    }

    private async Task CompleteAnyActiveGame()
    {
        var activeResponse = await _client.GetAsync("/api/games/active");
        if (activeResponse.IsSuccessStatusCode)
        {
            var activeGame = await activeResponse.Content.ReadFromJsonAsync<GameResponse>();
            if (activeGame != null)
            {
                await _client.PostAsJsonAsync($"/api/games/{activeGame.Id}/complete",
                    new CompleteGameRequest(new int[] { 1, 2, 3 }));
            }
        }
    }

    private static (int weekNumber, int year) GenerateUniqueWeekYear()
    {
        var hash = Math.Abs(Guid.NewGuid().GetHashCode());
        return ((hash % 52) + 1, 2020 + (hash % 81));
    }

    [Fact]
    public async Task Create_ReturnsCreatedGame()
    {
        // Arrange
        await CompleteAnyActiveGame();
        var (weekNumber, year) = GenerateUniqueWeekYear();
        var request = new CreateGameRequest(weekNumber, year);

        // Act
        var response = await _client.PostAsJsonAsync("/api/games", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var game = await response.Content.ReadFromJsonAsync<GameResponse>();
        game.Should().NotBeNull();
        game!.WeekNumber.Should().Be(weekNumber);
        game.Year.Should().Be(year);
        game.Status.Should().Be("Active");
        game.WinningNumbers.Should().BeNull();
    }

    [Fact]
    public async Task GetActive_ReturnsActiveGame()
    {
        // Arrange
        await CompleteAnyActiveGame();
        var (weekNumber, year) = GenerateUniqueWeekYear();
        var createRequest = new CreateGameRequest(weekNumber, year);
        await _client.PostAsJsonAsync("/api/games", createRequest);

        // Act
        var response = await _client.GetAsync("/api/games/active");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var game = await response.Content.ReadFromJsonAsync<GameResponse>();
        game.Should().NotBeNull();
        game!.Status.Should().Be("Active");
    }

    [Fact]
    public async Task Complete_SetsWinningNumbers()
    {
        // Arrange
        await CompleteAnyActiveGame();
        var (weekNumber, year) = GenerateUniqueWeekYear();
        var createRequest = new CreateGameRequest(weekNumber, year);
        var createResponse = await _client.PostAsJsonAsync("/api/games", createRequest);
        var createdGame = await createResponse.Content.ReadFromJsonAsync<GameResponse>();

        var completeRequest = new CompleteGameRequest(new int[] { 10, 20, 30 });

        // Act
        var response = await _client.PostAsJsonAsync($"/api/games/{createdGame!.Id}/complete", completeRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<GameResultResponse>();
        result.Should().NotBeNull();
        result!.WinningNumbers.Should().BeEquivalentTo(new int[] { 10, 20, 30 });
        result.TotalBoards.Should().Be(0);
        result.WinningBoards.Should().Be(0);
    }

    [Fact]
    public async Task Complete_WithInvalidNumberCount_ReturnsBadRequest()
    {
        // Arrange
        await CompleteAnyActiveGame();
        var (weekNumber, year) = GenerateUniqueWeekYear();
        var createRequest = new CreateGameRequest(weekNumber, year);
        var createResponse = await _client.PostAsJsonAsync("/api/games", createRequest);
        var createdGame = await createResponse.Content.ReadFromJsonAsync<GameResponse>();

        var completeRequest = new CompleteGameRequest(new int[] { 10, 20 }); // Only 2 numbers

        // Act
        var response = await _client.PostAsJsonAsync($"/api/games/{createdGame!.Id}/complete", completeRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Create_WithDuplicateWeekYear_ReturnsConflict()
    {
        // Arrange
        await CompleteAnyActiveGame();
        var (weekNumber, year) = GenerateUniqueWeekYear();
        var request = new CreateGameRequest(weekNumber, year);
        var firstResponse = await _client.PostAsJsonAsync("/api/games", request);
        firstResponse.EnsureSuccessStatusCode();

        // Complete the first game
        var firstGame = await firstResponse.Content.ReadFromJsonAsync<GameResponse>();
        await _client.PostAsJsonAsync($"/api/games/{firstGame!.Id}/complete",
            new CompleteGameRequest(new int[] { 1, 2, 3 }));

        // Try to create another game with same week/year
        var duplicateRequest = new CreateGameRequest(weekNumber, year);

        // Act
        var response = await _client.PostAsJsonAsync("/api/games", duplicateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
