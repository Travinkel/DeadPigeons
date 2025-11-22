# Seed development data for DeadPigeons
# Run from project root: .\scripts\seed-dev-data.ps1

param(
    [string]$ApiUrl = "http://localhost:5155"
)

Write-Host "Seeding development data..." -ForegroundColor Cyan

# Register admin user
Write-Host "Creating admin user..." -ForegroundColor Yellow
try {
    $adminBody = @{
        name = "Admin User"
        email = "admin@jerneif.dk"
        phone = "12345678"
        password = "Test123!"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$ApiUrl/api/Auth/register" -Method Post -Body $adminBody -ContentType "application/json"
    Write-Host "Admin user created: admin@jerneif.dk / Test123!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "Admin user already exists" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to create admin: $_" -ForegroundColor Red
    }
}

# Register player user
Write-Host "Creating player user..." -ForegroundColor Yellow
try {
    $playerBody = @{
        name = "Test Player"
        email = "player@jerneif.dk"
        phone = "87654321"
        password = "Test123!"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$ApiUrl/api/Auth/register" -Method Post -Body $playerBody -ContentType "application/json"
    Write-Host "Player user created: player@jerneif.dk / Test123!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "Player user already exists" -ForegroundColor Yellow
    } else {
        Write-Host "Failed to create player: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "NOTE: To promote admin@jerneif.dk to Admin role, run this SQL:" -ForegroundColor Cyan
Write-Host 'UPDATE "Players" SET "Role" = 1 WHERE "Email" = ''admin@jerneif.dk'';' -ForegroundColor White
Write-Host ""
Write-Host "Credentials:" -ForegroundColor Cyan
Write-Host "  Admin: admin@jerneif.dk / Test123!" -ForegroundColor White
Write-Host "  Player: player@jerneif.dk / Test123!" -ForegroundColor White
