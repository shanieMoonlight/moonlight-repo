import { EnvironmentProviders, Provider } from "@angular/core"
import { SeoConfig, SeoConfigService } from "./seo-config"


export class SeoSetup {

    /**
     * Gets an array of providers needed to set up the seo system.
     * 
     * @param config Optional custom seo configuration. 
     * @returns An array of providers to include in an application's provider array.
     */
    static provideSeoModule = (config: SeoConfig)
        : (Provider | EnvironmentProviders)[] => {
        return [
            {
                provide: SeoConfigService,
                useValue: config,
            },
        ]
    }

} //Cls