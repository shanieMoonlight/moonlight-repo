import { EnvironmentProviders, Provider } from "@angular/core"
import { ThemeConfig, ThemeConfigService } from "./theming-config"


export class ThemeAndModeSetup {

    static getThemeProviders = (config: ThemeConfig = ThemeConfig.Create())
        : (Provider | EnvironmentProviders)[] =>
        [
            {
                provide: ThemeConfigService,
                useValue: config,
            },
        ]

} //Cls