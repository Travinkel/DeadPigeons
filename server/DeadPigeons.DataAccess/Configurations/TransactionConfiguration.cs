using DeadPigeons.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeadPigeons.DataAccess.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Amount)
            .HasPrecision(18, 2);

        builder.Property(e => e.Type)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(e => e.MobilePayTransactionId)
            .HasMaxLength(50);

        builder.HasIndex(e => e.PlayerId);

        builder.HasIndex(e => e.IsApproved);

        // One-to-one with Board (optional)
        builder.HasOne(t => t.Board)
            .WithOne(b => b.Transaction)
            .HasForeignKey<Board>(b => b.TransactionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
