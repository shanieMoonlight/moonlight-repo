import { EnvironmentProviders, Provider } from "@angular/core"
import { ThemeConfig, ThemeConfigService } from "./theming-config"


export class ThemeAndModeSetup {

    static getThemeProviders = (config: ThemeConfig = ThemeConfig.create())
        : (Provider | EnvironmentProviders)[] =>
        [
            {
                provide: ThemeConfigService,
                useValue: config,
            },
        ]

} //Cls