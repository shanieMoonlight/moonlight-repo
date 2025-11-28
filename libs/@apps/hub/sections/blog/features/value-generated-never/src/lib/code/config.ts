export const TrustedDeviceConfigCode = `internal class TrustedDeviceConfig : IEntityTypeConfiguration<TrustedDevice>
{
    public void Configure(EntityTypeBuilder<TrustedDevice> builder)
    {
        builder.HasKey(x => x.Id);

        //Tell Ef Core that we are generating Ids on the client side
        builder.Property(x => x.Id)
            .ValueGeneratedNever();
        ...
    }
}`;






export const GlobalConfigCode = `public static void ApplyClientSideIdGeneration(this ModelBuilder modelBuilder)
{
    // 1. Iterate over all entities in the model
    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        // 2. Check if the current entity inherits from IdDomainEntity
        if (typeof(IdDomainEntity).IsAssignableFrom(entityType.ClrType))
        {
            // 3. Configure the Id property to never generate values from the DB
            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(IdDomainEntity.Id))
                .ValueGeneratedNever();
        }
    }
}`;





export const OnModelCreatingCode = `protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    
    // Apply our global fix
    modelBuilder.ApplyClientSideIdGeneration();
}`;





export const TldrConfigCode = `modelBuilder.Entity<Car>()
    .Property(p => p.Id)
    .ValueGeneratedNever();`;




