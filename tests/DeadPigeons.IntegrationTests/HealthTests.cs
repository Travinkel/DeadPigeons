using System.Net;

namespace DeadPigeons.IntegrationTests;

[Collection("IntegrationTests")]
public class HealthTests
{
    private readonly HttpClient _client;

    public HealthTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_Endpoint_Returns_OK()
    {
        var response = await _client.GetAsync("/health");
        var body = await response.Content.ReadAsStringAsync();
        Assert.True(response.IsSuccessStatusCode, $"Expected 200, got {(int)response.StatusCode} {response.StatusCode}. Body: {body}");
    }
}
