export const BlogConstants = {
  ValueGeneratedNever: {
    Title: 'EF Core: ValueGeneratedNever and Client-Side IDs',
    Subtitle: 'How to keep client-generated IDs and domain events working with EF Core',
    Description: `This post explains a common DDD + EF Core problem: when you generate entity IDs on the client (inside the domain) to support rich Domain Events, EF Core can wrongly treat those entities as existing and issue UPDATEs instead of INSERTs.

You will learn:
- Why EF Core infers entity state from primary key values
- How using .ValueGeneratedNever() (per-entity or globally) tells EF Core to accept client-generated IDs
- A safe global configuration pattern (ApplyClientSideIdGeneration) to apply the behavior across domain entities

The article includes example code snippets and a small global helper you can call from your DbContext.OnModelCreating to opt all Id-based domain entities into client-side ID generation.
`,
    GitHubRepo: 'https://github.com/shanieMoonlight/spider-baby-identity/blob/master/Identity/Tests/Id.Tests.Utility/LibrarySetup/ServiceCollectionReflectionHelper.cs',
    Keywords: ['EF Core', 'Entity Framework Core', 'ValueGeneratedNever', 'client-generated IDs', 'Domain Events', 'DDD', 'GUID', 'Primary Key', 'Concurrency', 'C#', '.NET'],
    // NpmPackage: 'https://www.npmjs.com/package/@spider-baby/auth-signal'
  }
};
