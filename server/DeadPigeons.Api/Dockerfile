FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY DeadPigeons.sln ./
COPY server/DeadPigeons.Api/*.csproj ./server/DeadPigeons.Api/
COPY server/DeadPigeons.DataAccess/*.csproj ./server/DeadPigeons.DataAccess/
COPY tests/DeadPigeons.Tests/*.csproj ./tests/DeadPigeons.Tests/
COPY tests/Integration/*.csproj ./tests/Integration/

RUN dotnet restore

# Copy source code
COPY server/ ./server/

RUN dotnet publish server/DeadPigeons.Api/DeadPigeons.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "DeadPigeons.Api.dll"]
