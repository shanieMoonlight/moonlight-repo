export const TestToAssertLibrary_RegistersInterfacesCode = `  [Fact]
  public void AddMyFancyLibrary_RegistersImplementationsForAllLocalInterfaces()
  {
      var services = new ServiceCollection();

      // register via action overload
      services.AddMyFancyLibrary(opts => { opts.ApiKey = "test"; });

      //Assembly so we know which interfaces to look for
      var asm = typeof(MyFancyOptions).Assembly;

      // Filter for interfaces declared in the target assembly and under the target namespace
      var interfaces = asm.GetTypes()
          .Where(t => t.IsInterface && t.IsPublic && t.Namespace != null && t.Namespace.StartsWith("MyCompany.MyFancy"))
          .ToList();

      //Runtime description of a DI registration created by the Microsoft.Extensions.DependencyInjection APIs.
      // This should contain all registered services after the setup call
      var descriptors = services.ToList();

      // Service provider to resolve factories
      var provider = services.BuildServiceProvider();

      //List of missing interfaces
      var missing = new List<string>();

      // For each interface check if there is a service descriptor that matches or a closed generic registered
      foreach (var iface in interfaces)
      {
          bool found = descriptors.Any(sd =>
          {
              //Only consider service descriptors with matching service type
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
                  catch {
                      // Ignore types that can't be constructed. We'll try to match other ways
                  }
              }

              // Check implementation type or instance
              if (sd.ImplementationType != null && iface.IsAssignableFrom(sd.ImplementationType)) 
                  return true;

              // Implementation instance known
              if (sd.ImplementationInstance != null && iface.IsAssignableFrom(sd.ImplementationInstance.GetType())) 
                  return true;

              //Last resort: try to create instance via factory and check assignability
              if (sd.ImplementationFactory != null)
              {
                  try
                  {
                      var instance = sd.ImplementationFactory(provider);
                      if (instance != null && iface.IsAssignableFrom(instance.GetType())) return true;
                  }
                  catch {
                      // Ignore types that can't be constructed. We'll try to match other ways    
                  }
              }

              // No match found
              return false;
          });

          // If not found, add to missing list
          if (!found) 
              missing.Add(iface.FullName ?? iface.Name);
      }

      // Assert with details on missing registrations
      missing.Count.ShouldBe(0, $"Missing registrations: {string.Join(", ", missing)}");
  }`;


export const TestToAssertLibrary_RegistersInterfacesCode_WithIconfigurationCode = `var config = new ConfigurationBuilder()
    .AddInMemoryCollection(new Dictionary<string, string?> { ["MyFancy:ApiKey"] = "cfg" })
    .Build();

services.AddMyFancyLibrary(config, "MyFancy");`