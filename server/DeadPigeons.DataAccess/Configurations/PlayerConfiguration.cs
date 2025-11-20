using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeadPigeons.DataAccess.Configurations;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(e => e.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(e => e.Email)
            .IsUnique();

        builder.HasIndex(e => e.IsActive);

        // Soft delete query filter
        builder.HasQueryFilter(p => p.DeletedAt == null);

        // Relationships
        builder.HasMany(p => p.Transactions)
            .WithOne(t => t.Player)
            .HasForeignKey(t => t.PlayerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Boards)
            .WithOne(b => b.Player)
            .HasForeignKey(b => b.PlayerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
