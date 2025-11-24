using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using DeadPigeons.DataAccess;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Testcontainers.PostgreSql;

namespace DeadPigeons.IntegrationTests;

public class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private const string TestJwtSecret = "TestSecretKeyForIntegrationTests_MustBe32CharsOrMore!";
    private const string TestJwtIssuer = "DeadPigeons";
    private const string TestJwtAudience = "DeadPigeons";

    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:16")
        .WithDatabase("deadpigeons_test")
        .WithUsername("test")
        .WithPassword("test")
        .Build();

    private string? _connectionString;
    private bool _containerStarted;

    private void EnsureContainerStarted()
    {
        if (_containerStarted)
        {
            return;
        }

        _dbContainer.StartAsync().GetAwaiter().GetResult();
        _connectionString = _dbContainer.GetConnectionString();
        _containerStarted = true;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        EnsureContainerStarted();

        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = TestJwtSecret,
                ["Jwt:Issuer"] = TestJwtIssuer,
                ["Jwt:Audience"] = TestJwtAudience,
                ["HttpsRedirection:Enabled"] = "false" // Disable HTTPS redirect for TestServer
            });
        });

        builder.ConfigureServices(services =>
        {
            // Remove ALL EF Core services to avoid provider conflicts
            var efDescriptors = services
                .Where(d => d.ServiceType.FullName?.Contains("EntityFramework") == true)
                .ToList();
            foreach (var d in efDescriptors)
                services.Remove(d);

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(_connectionString ?? throw new InvalidOperationException("Test container connection string not initialized")));

            // Remove and re-add JWT authentication with test settings
            // (Program.cs captures config values before ConfigureAppConfiguration runs)
            var authDescriptors = services
                .Where(d => d.ServiceType.FullName?.Contains("Authentication") == true ||
                            d.ServiceType.FullName?.Contains("JwtBearer") == true)
                .ToList();
            foreach (var d in authDescriptors)
                services.Remove(d);

            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = TestJwtIssuer,
                        ValidAudience = TestJwtAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(TestJwtSecret))
                    };
                });
        });
    }

    public async Task InitializeAsync()
    {
        EnsureContainerStarted();

        // Apply migrations + seed baseline data
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
        await DatabaseSeeder.SeedAsync(db);
    }

    public HttpClient CreateAuthenticatedClient(string role = "Admin", Guid? userId = null)
    {
        var client = CreateClient();
        var token = GenerateTestToken(role, userId ?? Guid.NewGuid());
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    private static string GenerateTestToken(string role, Guid userId)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestJwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, $"test-{role.ToLower()}@example.com"),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: TestJwtIssuer,
            audience: TestJwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public new async Task DisposeAsync()
    {
        if (_containerStarted)
        {
            await _dbContainer.StopAsync();
            await _dbContainer.DisposeAsync();
        }
    }
}
