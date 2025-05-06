import { EnvironmentProviders, Provider } from "@angular/core"
import { SeoConfig, SeoConfigService } from "./seo-config"
import { devConsole } from "@spider-baby/dev-console"


export class SeoSetup {

    /**
     * Gets an array of providers needed to set up the seo system.
     * 
     * @param config Optional custom seo configuration. 
     * @returns An array of providers to include in an application's provider array.
     */
    static provideSeoModule = (config: SeoConfig): (Provider | EnvironmentProviders)[] => {
      // Validate that config is a proper SeoConfig instance
      if (!(config instanceof SeoConfig)) 
        throw new Error('SeoSetup: The provided config must be created using SeoConfig.create()')

      // devConsole.log('SeoSetup: Initializing SEO module with config:', config)
        
        return [
          { provide: SeoConfigService, useValue: config }
        ];
      }

} //Cls