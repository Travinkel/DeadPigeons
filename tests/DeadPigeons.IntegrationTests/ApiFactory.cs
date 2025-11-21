using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using DeadPigeons.DataAccess;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
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

    private readonly bool _useTestcontainers;
    private PostgreSqlContainer? _dbContainer;
    private DbConnection? _sqliteConnection;

    public ApiFactory()
    {
        var value = Environment.GetEnvironmentVariable("USE_TESTCONTAINERS");
        _useTestcontainers = string.Equals(value, "true", StringComparison.OrdinalIgnoreCase);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = TestJwtSecret,
                ["Jwt:Issuer"] = TestJwtIssuer,
                ["Jwt:Audience"] = TestJwtAudience
            });
        });

        builder.ConfigureServices(services =>
        {
            // Remove existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            if (_useTestcontainers && _dbContainer != null)
            {
                // Use Testcontainers PostgreSQL
                services.AddDbContext<AppDbContext>(options =>
                    options.UseNpgsql(_dbContainer.GetConnectionString()));
            }
            else
            {
                // Use SQLite in-memory for local development without Docker
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlite(_sqliteConnection!));
            }
        });
    }

    public async Task InitializeAsync()
    {
        if (_useTestcontainers)
        {
            // Build and start PostgreSQL container
            _dbContainer = new PostgreSqlBuilder()
                .WithImage("postgres:16")
                .WithDatabase("deadpigeons_test")
                .WithUsername("test")
                .WithPassword("test")
                .Build();

            await _dbContainer.StartAsync();

            // Apply migrations
            using var scope = Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();
        }
        else
        {
            // Create SQLite in-memory connection (keep it open for the test lifetime)
            _sqliteConnection = new SqliteConnection("DataSource=:memory:");
            await _sqliteConnection.OpenAsync();

            // Create database schema
            using var scope = Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.EnsureCreatedAsync();
        }
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
        if (_dbContainer != null)
        {
            await _dbContainer.StopAsync();
            await _dbContainer.DisposeAsync();
        }

        if (_sqliteConnection != null)
        {
            await _sqliteConnection.CloseAsync();
            await _sqliteConnection.DisposeAsync();
        }
    }
}
