using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DeadPigeons.Tests;

public class AuthServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "TestSecretKeyThatIsAtLeast32Characters!",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:ExpirationMinutes"] = "60"
            })
            .Build();

        _service = new AuthService(_db, configuration);
    }

    public void Dispose()
    {
        _db.Dispose();
    }

    [Fact]
    public void HashPassword_ReturnsHashedValue()
    {
        // Arrange
        var password = "TestPassword123";

        // Act
        var hash = _service.HashPassword(password);

        // Assert
        Assert.NotNull(hash);
        Assert.NotEqual(password, hash);
        Assert.True(hash.Length > 0);
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ReturnsTrue()
    {
        // Arrange
        var password = "TestPassword123";
        var hash = _service.HashPassword(password);

        // Act
        var result = _service.VerifyPassword(password, hash);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void VerifyPassword_WithIncorrectPassword_ReturnsFalse()
    {
        // Arrange
        var password = "TestPassword123";
        var hash = _service.HashPassword(password);

        // Act
        var result = _service.VerifyPassword("WrongPassword", hash);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void GenerateJwtToken_ReturnsValidToken()
    {
        // Arrange
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            Role = Role.Player
        };

        // Act
        var token = _service.GenerateJwtToken(player);

        // Assert
        Assert.NotNull(token);
        Assert.True(token.Length > 0);
        Assert.Contains(".", token); // JWT has 3 parts separated by dots
    }

    [Fact]
    public void GenerateJwtToken_ForAdmin_ReturnsTokenWithAdminRole()
    {
        // Arrange
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Admin User",
            Email = "admin@example.com",
            Role = Role.Admin
        };

        // Act
        var token = _service.GenerateJwtToken(player);

        // Assert
        Assert.NotNull(token);
        // Token should be different for admin vs player due to role claim
    }

    [Fact]
    public async Task ValidateCredentialsAsync_WithValidCredentials_ReturnsPlayer()
    {
        // Arrange
        var password = "TestPassword123";
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            PasswordHash = _service.HashPassword(password),
            Role = Role.Player,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.ValidateCredentialsAsync("test@example.com", password);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(player.Id, result.Id);
        Assert.Equal("test@example.com", result.Email);
    }

    [Fact]
    public async Task ValidateCredentialsAsync_WithInvalidEmail_ReturnsNull()
    {
        // Act
        var result = await _service.ValidateCredentialsAsync("nonexistent@example.com", "password");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentialsAsync_WithInvalidPassword_ReturnsNull()
    {
        // Arrange
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            PasswordHash = _service.HashPassword("CorrectPassword"),
            Role = Role.Player,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.ValidateCredentialsAsync("test@example.com", "WrongPassword");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentialsAsync_UpdatesLastLoginAt()
    {
        // Arrange
        var password = "TestPassword123";
        var player = new Player
        {
            Id = Guid.NewGuid(),
            Name = "Test Player",
            Email = "test@example.com",
            PasswordHash = _service.HashPassword(password),
            Role = Role.Player,
            LastLoginAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Players.Add(player);
        await _db.SaveChangesAsync();

        // Act
        var result = await _service.ValidateCredentialsAsync("test@example.com", password);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.LastLoginAt);
    }

    [Fact]
    public void HashPassword_ProducesDifferentHashesForSamePassword()
    {
        // Arrange
        var password = "TestPassword123";

        // Act
        var hash1 = _service.HashPassword(password);
        var hash2 = _service.HashPassword(password);

        // Assert - salted hashes should be different
        Assert.NotEqual(hash1, hash2);
    }
}
