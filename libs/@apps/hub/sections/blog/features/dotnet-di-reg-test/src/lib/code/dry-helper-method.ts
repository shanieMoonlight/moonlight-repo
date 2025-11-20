export const ServiceCollectionReflectionHelperCode = `/// <summary>
/// Asserts that after calling <paramref name="registerAction"/> the service collection contains
/// registrations for all public interfaces declared in <paramref name="assembly"/> whose namespace
/// starts with <paramref name="namespacePrefix"/>.
/// </summary>
/// <param name="assembly">Assembly to scan for interfaces.</param>
/// <param name="namespacePrefix">Namespace prefix to filter interfaces.</param>
/// <param name="registerAction">Action that performs registrations on an IServiceCollection.</param>
/// <param name="exclude">Optional predicate to exclude specific interfaces from the check.</param>
public static void AssertAllInterfacesRegistered(
    Assembly assembly,
    string namespacePrefix,
    Func<IServiceCollection, IServiceCollection> registerAction,
    Func<Type, bool>? exclude = null)
{
    ArgumentNullException.ThrowIfNull(assembly);
    ArgumentNullException.ThrowIfNull(namespacePrefix);
    ArgumentNullException.ThrowIfNull(registerAction);

    var services = new ServiceCollection();
    registerAction(services);

    var descriptors = services.ToList();

    // Build a provider to allow invoking factories when necessary
    var provider = services.BuildServiceProvider();

    //We are filtering for public interfaces , but you could adjust this as needed
    var interfaces = assembly.GetTypes()
        .Where(t => t.IsInterface && t.IsPublic && t.Namespace != null && t.Namespace.StartsWith(namespacePrefix, StringComparison.Ordinal))
        .Where(t => exclude == null || !exclude(t))
        .ToList();

    var missing = new List<string>();

    foreach (var iface in interfaces)
    {
        bool found = descriptors.Any(sd =>
        {
            // Direct service type match
            if (sd.ServiceType == iface)
                return true;

            // Service registered as closed generic where the generic definition matches
            if (iface.IsGenericTypeDefinition && sd.ServiceType.IsGenericType)
            {
                try
                {
                    if (sd.ServiceType.GetGenericTypeDefinition() == iface)
                        return true;
                }
                catch
                {
                    // ignore malformed generic types
                }
            }

            // Implementation type assignable to interface
            if (sd.ImplementationType != null && iface.IsAssignableFrom(sd.ImplementationType))
                return true;

            // Implementation instance known
            if (sd.ImplementationInstance != null && iface.IsAssignableFrom(sd.ImplementationInstance.GetType()))
                return true;

            // Implementation factory invocation
            if (sd.ImplementationFactory != null)
            {
                try
                {
                    var instance = sd.ImplementationFactory(provider);
                    if (instance != null && iface.IsAssignableFrom(instance.GetType()))
                        return true;
                }
                catch
                {
                    // ignore factory invocation failures
                }
            }

            return false;
        });

        if (!found)
            missing.Add(iface.FullName ?? iface.Name);
    }

    missing.Count.ShouldBe(0, $"The following interfaces declared in the assembly '{assembly.GetName().Name}' were not registered: {string.Join(", ", missing)}");
}

`;




export const UsingDryHelperMethodCode = `public class MyFancyLibraryRegistrationTests
{
    [Fact]
    public void AddMyFancyLibrary_RegistersAllLocalInterfaces_ActionOverload()
    {
        var assembly = typeof(MyFancyOptions).Assembly;
        ServiceCollectionReflectionHelper.AssertAllInterfacesRegistered(
            assembly,
            "MyCompany.MyFancy",
            services => services.AddMyFancyLibrary(opts => { opts.ApiKey = "x"; })
        );
    }



    [Fact]
    public void AddMyFancyLibrary_RegistersAllLocalInterfaces_ConfigurationOverload()
    {
        var inMem = new Dictionary<string, string?> { ["MyFancy:ApiKey"] = "cfg" };
        var config = new ConfigurationBuilder().AddInMemoryCollection(inMem).Build();

        var assembly = typeof(MyFancyOptions).Assembly;
        ServiceCollectionReflectionHelper.AssertAllInterfacesRegistered(
            assembly,
            "MyCompany.MyFancy",
            services => services.AddMyFancyLibrary(config, "MyFancy")
        );
    }
}`