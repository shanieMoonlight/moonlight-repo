export const ServiceCollectionReflectionHelperCode = `
    /// <summary>
    /// Configures the EF Core model so that entities deriving from <see cref="MyDomainEntity"/>
    /// use client-side id generation.
    /// </summary>
    /// <param name="modelBuilder">The <see cref="ModelBuilder"/> being configured.</param>
    /// <remarks>
    /// This method iterates all entity types registered in <paramref name="modelBuilder"/>
    /// and for each CLR type that derives from <see cref="MyDomainEntity"/>, it sets the
    /// <c>Id</c> property to <see cref="Microsoft.EntityFrameworkCore.Metadata.ValueGenerated.Never"/>
    /// by calling <c>ValueGeneratedNever()</c>. This prevents EF Core / the database from
    /// generating values for the Id column so the application is responsible for assigning ids.
    /// </remarks>
    public static void ApplyClientSideIdGeneration(this ModelBuilder modelBuilder)
    {
        // 1. Iterate over all entities in the model
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            // 2. Check if the current entity inherits from MyDomainEntity
            if (typeof(MyDomainEntity).IsAssignableFrom(entityType.ClrType))
                // 3. Configure the Id property to never generate values from the DB
                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(MyDomainEntity.Id))
                    .ValueGeneratedNever();

        }
    }

}`;

