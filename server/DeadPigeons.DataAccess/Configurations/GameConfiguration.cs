using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeadPigeons.DataAccess.Configurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // PostgreSQL array for winning numbers
        builder.Property(e => e.WinningNumbers)
            .HasColumnType("integer[]");

        // Unique constraint on Year + WeekNumber
        builder.HasIndex(e => new { e.Year, e.WeekNumber })
            .IsUnique();

        builder.HasIndex(e => e.Status);
    }
}
