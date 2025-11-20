using System.Net;
using System.Net.Http.Json;
using DeadPigeons.Api.Dtos;
using FluentAssertions;

namespace DeadPigeons.IntegrationTests;

[Collection("IntegrationTests")]
public class PlayersApiTests
{
    private readonly HttpClient _client;

    public PlayersApiTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsEmptyList_WhenNoPlayers()
    {
        // Act
        var response = await _client.GetAsync("/api/players");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var players = await response.Content.ReadFromJsonAsync<List<PlayerResponse>>();
        players.Should().NotBeNull();
    }

    [Fact]
    public async Task Create_ReturnsCreatedPlayer()
    {
        // Arrange
        var request = new CreatePlayerRequest("Test Player", $"test{Guid.NewGuid()}@example.com", "12345678");

        // Act
        var response = await _client.PostAsJsonAsync("/api/players", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var player = await response.Content.ReadFromJsonAsync<PlayerResponse>();
        player.Should().NotBeNull();
        player!.Name.Should().Be("Test Player");
        player.Email.Should().Contain("@example.com");
        player.Phone.Should().Be("12345678");
        player.IsActive.Should().BeFalse();  // Players inactive by default per domain spec
    }

    [Fact]
    public async Task GetById_ReturnsPlayer_WhenExists()
    {
        // Arrange
        var createRequest = new CreatePlayerRequest("Get Test", $"get{Guid.NewGuid()}@example.com", null);
        var createResponse = await _client.PostAsJsonAsync("/api/players", createRequest);
        var createdPlayer = await createResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        // Act
        var response = await _client.GetAsync($"/api/players/{createdPlayer!.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var player = await response.Content.ReadFromJsonAsync<PlayerResponse>();
        player.Should().NotBeNull();
        player!.Id.Should().Be(createdPlayer.Id);
        player.Name.Should().Be("Get Test");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenNotExists()
    {
        // Act
        var response = await _client.GetAsync($"/api/players/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Update_UpdatesPlayer()
    {
        // Arrange
        var createRequest = new CreatePlayerRequest("Original", $"update{Guid.NewGuid()}@example.com", null);
        var createResponse = await _client.PostAsJsonAsync("/api/players", createRequest);
        var createdPlayer = await createResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        var updateRequest = new UpdatePlayerRequest("Updated", createdPlayer!.Email, "99999999", false);

        // Act
        var response = await _client.PutAsJsonAsync($"/api/players/{createdPlayer.Id}", updateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var player = await response.Content.ReadFromJsonAsync<PlayerResponse>();
        player!.Name.Should().Be("Updated");
        player.Phone.Should().Be("99999999");
        player.IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task Delete_SoftDeletesPlayer()
    {
        // Arrange
        var createRequest = new CreatePlayerRequest("ToDelete", $"delete{Guid.NewGuid()}@example.com", null);
        var createResponse = await _client.PostAsJsonAsync("/api/players", createRequest);
        var createdPlayer = await createResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        // Act
        var deleteResponse = await _client.DeleteAsync($"/api/players/{createdPlayer!.Id}");

        // Assert
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify player is no longer returned
        var getResponse = await _client.GetAsync($"/api/players/{createdPlayer.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetBalance_ReturnsZero_WhenNoTransactions()
    {
        // Arrange
        var createRequest = new CreatePlayerRequest("Balance Test", $"balance{Guid.NewGuid()}@example.com", null);
        var createResponse = await _client.PostAsJsonAsync("/api/players", createRequest);
        var createdPlayer = await createResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        // Act
        var response = await _client.GetAsync($"/api/players/{createdPlayer!.Id}/balance");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var balance = await response.Content.ReadFromJsonAsync<PlayerBalanceResponse>();
        balance!.Balance.Should().Be(0);
    }
}
