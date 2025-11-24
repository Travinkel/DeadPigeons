using System.Text;
using DeadPigeons.Api.Services;
using DeadPigeons.DataAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Fly.io DATABASE_URL parsing
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
if (!string.IsNullOrEmpty(databaseUrl))
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    var connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
    builder.Configuration["ConnectionStrings:Default"] = connectionString;
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var httpsRedirectEnabled = builder.Configuration.GetValue("HttpsRedirection:Enabled", true);
var envName = builder.Environment.EnvironmentName;
var corsOrigins = new[]
{
    "http://localhost:5173",
    "https://deadpigeons-client.fly.dev"
};
var hasConnectionString = !string.IsNullOrEmpty(builder.Configuration.GetConnectionString("Default"));

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("JWT Secret not configured");

if (jwtSecret.Length < 32)
    throw new InvalidOperationException("JWT Secret must be at least 32 characters");

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "DeadPigeons";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "DeadPigeons";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("RequirePlayer", policy =>
        policy.RequireRole("Player", "Admin"));

    options.AddPolicy("RequireAuthenticated", policy =>
        policy.RequireAuthenticatedUser());
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IBoardService, BoardService>();
builder.Services.AddScoped<IGameService, GameService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

if (httpsRedirectEnabled)
{
    app.UseHttpsRedirection();
}

app.UseMiddleware<DeadPigeons.Api.Middleware.CorrelationIdMiddleware>();

// CORS must be before auth
app.UseCors("AllowClient");

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoints for deployment verification
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Seed database on startup (for development/demo)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DatabaseSeeder.SeedAsync(context);
}

app.Logger.LogInformation("Startup: Env={Env}, ConnectionStringPresent={HasCs}, HttpsRedirect={Https}, CorsOrigins={Origins}",
    envName, hasConnectionString, httpsRedirectEnabled, string.Join(",", corsOrigins));

app.Run();

public partial class Program;
