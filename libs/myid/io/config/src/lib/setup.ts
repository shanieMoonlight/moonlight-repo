import { EnvironmentProviders, Provider } from "@angular/core"
import { MyIdIoConfig, MyIdIoConfigService } from "./config"


export class MyIdIoSetup {

    /**
     * Gets an array of providers needed to set up the theming system.
     * 
     * @param config Optional custom theme configuration. Defaults to a basic 
     *               configuration with standard themes if not provided.
     * @returns An array of providers to include in an application's provider array.
     */
    static provideMyIdIo = (config: MyIdIoConfig)
        : (Provider | EnvironmentProviders)[] =>
        {            
            return [
                {
                    provide: MyIdIoConfigService,
                    useValue: config,
                },
            ]
        }

} //Cls