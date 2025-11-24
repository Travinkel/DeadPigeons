using Microsoft.Extensions.DependencyInjection;

namespace DeadPigeons.Tests;

public class TestServiceFixture : IDisposable
{
    private readonly ServiceProvider _provider;

    public TestServiceFixture()
    {
        var services = new ServiceCollection();
        new Startup().ConfigureServices(services);
        _provider = services.BuildServiceProvider();

        // Seed each in-memory database instance
        using var scope = _provider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DeadPigeons.DataAccess.AppDbContext>();
        DeadPigeons.DataAccess.DatabaseSeeder.SeedAsync(db).GetAwaiter().GetResult();
    }

    public IServiceScope CreateScope() => _provider.CreateScope();

    public void Dispose()
    {
        _provider.Dispose();
    }
}
