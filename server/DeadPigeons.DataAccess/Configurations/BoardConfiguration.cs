using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeadPigeons.DataAccess.Configurations;

public class BoardConfiguration : IEntityTypeConfiguration<Board>
{
    public void Configure(EntityTypeBuilder<Board> builder)
    {
        builder.HasKey(e => e.Id);

        // PostgreSQL array for numbers
        builder.Property(e => e.Numbers)
            .HasColumnType("integer[]");

        builder.HasIndex(e => e.PlayerId);

        builder.HasIndex(e => e.GameId);

        // Composite index for winner detection
        builder.HasIndex(e => new { e.GameId, e.Numbers });

        // Relationships
        builder.HasOne(b => b.Game)
            .WithMany(g => g.Boards)
            .HasForeignKey(b => b.GameId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
