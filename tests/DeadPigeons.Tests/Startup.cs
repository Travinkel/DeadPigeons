using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeadPigeons.Tests;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Register configuration for JWT settings
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "TestSecretKeyThatIsAtLeast32Characters!",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:ExpirationMinutes"] = "60"
            })
            .Build();
        services.AddSingleton<IConfiguration>(configuration);

        // Register DbContext with unique in-memory database per test
        services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()));

        // Logging for services under test
        services.AddLogging();

        // Register application services
        services.AddScoped<IPlayerService, PlayerService>();
        services.AddScoped<IGameService, GameService>();
        services.AddScoped<IBoardService, BoardService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IAuthService, AuthService>();
    }
}
