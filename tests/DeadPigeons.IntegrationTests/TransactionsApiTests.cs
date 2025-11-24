using System.Net;
using System.Net.Http.Json;
using DeadPigeons.Api.Dtos;
using FluentAssertions;

namespace DeadPigeons.IntegrationTests;

[Collection("IntegrationTests")]
public class TransactionsApiTests
{
    private readonly HttpClient _client;

    public TransactionsApiTests(ApiFactory factory)
    {
        _client = factory.CreateAuthenticatedClient("Admin");
    }

    [Fact]
    public async Task CreateDeposit_ReturnsCreatedTransaction()
    {
        // Arrange
        var playerRequest = new CreatePlayerRequest("Deposit Test", $"deposit{Guid.NewGuid()}@example.com", null);
        var playerResponse = await _client.PostAsJsonAsync("/api/players", playerRequest);
        var player = await playerResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        var depositRequest = new CreateDepositRequest(player!.Id, 100m, "MP12345");

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions/deposit", depositRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var transaction = await response.Content.ReadFromJsonAsync<TransactionResponse>();
        transaction.Should().NotBeNull();
        transaction!.PlayerId.Should().Be(player.Id);
        transaction.Amount.Should().Be(100m);
        transaction.Type.Should().Be("Deposit");
        transaction.MobilePayTransactionId.Should().Be("MP12345");
        transaction.IsApproved.Should().BeFalse();
    }

    [Fact]
    public async Task Approve_ApprovesTransaction()
    {
        // Arrange
        var playerRequest = new CreatePlayerRequest("Approve Test", $"approve{Guid.NewGuid()}@example.com", null);
        var playerResponse = await _client.PostAsJsonAsync("/api/players", playerRequest);
        var player = await playerResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        var depositRequest = new CreateDepositRequest(player!.Id, 50m, "MP-APPROVE-1");
        var depositResponse = await _client.PostAsJsonAsync("/api/transactions/deposit", depositRequest);
        var transaction = await depositResponse.Content.ReadFromJsonAsync<TransactionResponse>();

        var approveRequest = new ApproveTransactionRequest(Guid.NewGuid());

        // Act
        var response = await _client.PostAsJsonAsync($"/api/transactions/{transaction!.Id}/approve", approveRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var approvedTransaction = await response.Content.ReadFromJsonAsync<TransactionResponse>();
        approvedTransaction!.IsApproved.Should().BeTrue();
        approvedTransaction.ApprovedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task GetPending_ReturnsOnlyUnapprovedTransactions()
    {
        // Arrange
        var playerRequest = new CreatePlayerRequest("Pending Test", $"pending{Guid.NewGuid()}@example.com", null);
        var playerResponse = await _client.PostAsJsonAsync("/api/players", playerRequest);
        var player = await playerResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        // Create deposit
        var depositRequest = new CreateDepositRequest(player!.Id, 75m, "MP-PENDING-1");
        await _client.PostAsJsonAsync("/api/transactions/deposit", depositRequest);

        // Act
        var response = await _client.GetAsync("/api/transactions/pending");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var transactions = await response.Content.ReadFromJsonAsync<List<TransactionResponse>>();
        transactions.Should().NotBeNull();
        transactions!.Should().OnlyContain(t => t.IsApproved == false);
    }

    [Fact]
    public async Task GetByPlayerId_ReturnsPlayerTransactions()
    {
        // Arrange
        var playerRequest = new CreatePlayerRequest("History Test", $"history{Guid.NewGuid()}@example.com", null);
        var playerResponse = await _client.PostAsJsonAsync("/api/players", playerRequest);
        var player = await playerResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        // Create two deposits
        await _client.PostAsJsonAsync("/api/transactions/deposit", new CreateDepositRequest(player!.Id, 100m, "MP-BULK-1"));
        await _client.PostAsJsonAsync("/api/transactions/deposit", new CreateDepositRequest(player.Id, 200m, "MP-BULK-2"));

        // Act
        var response = await _client.GetAsync($"/api/transactions/player/{player.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var transactions = await response.Content.ReadFromJsonAsync<List<TransactionResponse>>();
        transactions.Should().HaveCountGreaterThanOrEqualTo(2);
        transactions!.Should().OnlyContain(t => t.PlayerId == player.Id);
    }

    [Fact]
    public async Task ApprovedDeposit_UpdatesPlayerBalance()
    {
        // Arrange
        var playerRequest = new CreatePlayerRequest("Balance Test", $"baltest{Guid.NewGuid()}@example.com", null);
        var playerResponse = await _client.PostAsJsonAsync("/api/players", playerRequest);
        var player = await playerResponse.Content.ReadFromJsonAsync<PlayerResponse>();

        var depositRequest = new CreateDepositRequest(player!.Id, 100m, "MP-BAL-1");
        var depositResponse = await _client.PostAsJsonAsync("/api/transactions/deposit", depositRequest);
        var transaction = await depositResponse.Content.ReadFromJsonAsync<TransactionResponse>();

        // Approve
        await _client.PostAsJsonAsync($"/api/transactions/{transaction!.Id}/approve", new ApproveTransactionRequest(Guid.NewGuid()));

        // Act
        var balanceResponse = await _client.GetAsync($"/api/players/{player.Id}/balance");

        // Assert
        var balance = await balanceResponse.Content.ReadFromJsonAsync<PlayerBalanceResponse>();
        balance!.Balance.Should().Be(100m);
    }
}
