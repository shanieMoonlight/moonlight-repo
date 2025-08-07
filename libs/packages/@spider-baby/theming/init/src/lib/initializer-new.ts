// Don't use yet because this is not working with the Angular < 19 
// Wait til V21 or 22 to use this




// import { EnvironmentProviders, Provider, inject, provideAppInitializer } from "@angular/core";
// import { MaterialThemingSetup, ThemingConfig } from "@spider-baby/material-theming/config";
// import { SbThemeService } from '@spider-baby/material-theming/service';

// // Export a provider function for use in app.config.ts or bootstrapApplication

// function themeInitializer() {
//   const themeService = inject(SbThemeService);
//   return themeService.refreshTheme();
// }

// /**
//  * Sets up SpiderBaby Material Theming in one line.
//  * 
//  * @param config Optional theme config. If omitted, defaults will be used.
//  * @returns Providers for both config and theme initialization.
//  * 
//  * ⚠️ Only use this if you are NOT using any SpiderBaby theming components or injecting ThemeService directly.
//  * This will eagerly include all theming services in your bundle, which may increase bundle size.
//  * For most apps, using a theming component or ThemeService using MaterialThemingSetup.provideTheming(config) 
//  * is sufficient and more efficient.
//  */
// export function provideThemeInitializer(config?: ThemingConfig): (Provider | EnvironmentProviders)[] {
//   return [
//     MaterialThemingSetup.provideTheming(config),
//     provideAppInitializer(themeInitializer)
//   ];
// }
