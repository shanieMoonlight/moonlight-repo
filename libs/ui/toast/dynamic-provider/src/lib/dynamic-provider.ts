import { EnvironmentProviders, Provider } from '@angular/core';
import { ToastService } from '@spider-baby/ui-toast';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';

/**
 * Dynamic setup utility for Toast service with route-scoped configuration.
 * 
 * This class provides a simple way to configure toast services at the route or component level,
 * ensuring that each route can have its own toast configuration (positioning, animations, etc.)
 * while maintaining proper Angular dependency injection.
 * 
 * @example
 * ```typescript
 * // In route providers
 * providers: [
 *   ...ToastDynamicSetup.getProviders(
 *     ToastConfig.Create().setPositionConfig(
 *       ToastPositionConfig.Create(undefined, undefined, 300, undefined)
 *     )
 *   )
 * ]
 * 
 * // Or in component providers
 * @Component({
 *   providers: [...ToastDynamicSetup.getProviders(customConfig)]
 * })
 * ```
 */
export class ToastDynamicSetup {

    /**
     * Creates providers for route-scoped or component-scoped toast configuration.
     * 
     * This method returns both the configuration token and a route-scoped ToastService
     * instance that will use the provided configuration instead of global defaults.
     * 
     * @param config - Toast configuration object. Defaults to ToastConfig.Create() if not provided.
     * @returns Array of providers to be used in route or component provider arrays.
     */
    static getProviders(config: ToastConfig = ToastConfig.Create()): (Provider | EnvironmentProviders)[] {

        return [
            {
                provide: TOAST_CONFIG_TOKEN,
                useValue: config,
            },
            ToastService
        ]

    }

}
