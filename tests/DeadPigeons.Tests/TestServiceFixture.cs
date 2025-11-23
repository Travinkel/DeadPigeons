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
    }

    public IServiceScope CreateScope() => _provider.CreateScope();

    public void Dispose()
    {
        _provider.Dispose();
    }
}
