
export const MyFancyOptionsCode = `//Custom configuration options class
public class MyFancyOptions
{
    public string ApiKey { get; set; } = default!;
}`;



export const MyFancySetupExtensionsCode = `//Setup extension methods for IServiceCollection
public static class MyFancySetupExtensions
{
    public static IServiceCollection AddMyFancyLibrary(
        this IServiceCollection services, Action<MyFancyOptions> config)
    {
        services.Configure(config);

        return services.AddMyFancyLibraryServices();
    }




    public static IServiceCollection AddMyFancyLibrary(
        this IServiceCollection services, IConfiguration configuration, string sectionName = "MyFancy")
    {
        ArgumentNullException.ThrowIfNull(configuration);

        // If sectionName provided, get that section; otherwise assume configuration is already the MyFancy section
        var configSection = string.IsNullOrWhiteSpace(sectionName)
            ? configuration
            : configuration.GetSection(sectionName);

        services.Configure<MyFancyOptions>(configSection);


        return services.AddMyFancyLibraryServices();
    }




    public static IServiceCollection AddMyFancyLibraryServices(this IServiceCollection services)
    {
        // sample service registrations the library provides
        services.AddSingleton<IFooService, FooService>();
        services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IBarService>(sp => new BarService(sp.GetRequiredService<IConfiguration>().GetValue<string>("Bar:Name")));

        return services;
    }


}`;
