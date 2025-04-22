import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@moonlight/material/theming/components';
import { DEFAULT_COLOR_TONES } from '@moonlight/material/theming/config';
import { MlThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';
import { ThemeBannerComponent } from '../../../../shared/ui/banner/theme-banner.component';
@Component({
  selector: 'ml-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    MlThemeShowcaseMatComponent,
    ThemeBannerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  protected _tones = signal(DEFAULT_COLOR_TONES)


  // Installation and setup code snippets as signals
  protected _npmInstallCmd = signal('npm install @moonlight/material/theming');

  protected _basicSetupCode = signal(`// app.config.ts
import { ThemeAndModeSetup } from '@moonlight/material/theming/config';

export const appConfig: ApplicationConfig = {
providers: [
  // ... other providers
    ThemeAndModeSetup.provideThemingModule(THEME_CONFIG)
]
};`);


protected _customConfigCode = signal(`// app-theme.config.ts

  import { ThemeConfig } from '@moonlight/material/theming/config';
  
  export const THEME_CONFIG = ThemeConfig.create([
    { 
      value: 'ocean-blue', 
      label: 'Ocean Blue', 
      primaryColor: '#0277BD', 
      secondaryColor: '#26A69A' 
    },
    { 
      value: 'sunset-orange', 
      label: 'Sunset Orange', 
      primaryColor: '#FF5722', 
      secondaryColor: '#FFC107' 
    }
  ]);
  `);

protected _customConfigAcvancedCode = signal(`// app-theme.config.ts (Dynamic)
 
  import { ThemeConfig, ThemeOption } from '@moonlight/material/theming/config';

  const today = new Date();
  const thisYear = today.getFullYear();
  const xmasTime = new Date(thisYear, 11, 1);
  const halloweenTimeStart = new Date(thisYear, 10, 1);
  const halloweenTimeEnd = new Date(thisYear, 11, 1);
  export const IS_XMAS = today >= xmasTime;
  export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;


  const _themeOptions: ThemeOption[] = [
    ThemeOption.create({
      value: 'ocean-blue', 
      label: 'Ocean Blue', 
      primaryColor: '#0277BD', 
      secondaryColor: '#26A69A' 
    }),
    ThemeOption.create({
      value: 'sunset-orange', 
      label: 'Sunset Orange', 
      primaryColor: '#FF5722', 
      secondaryColor: '#FFC107' 
    })
  ];

  export const XMAS_THEME: ThemeOption = ThemeOption.create({
    darkMode: false,
    label: 'Xmas',
    value: 'xmas',
    primaryColor: '#C8102E',
    secondaryColor: '#006747',
  });

  export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
    darkMode: true,
    label: 'Halloween',
    value: 'halloween-theme',
    primaryColor: '#FF7518',
    secondaryColor: '#31004a',
  });

  if (IS_XMAS) _themeOptions.push(XMAS_THEME);
  if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

  export const THEME_CONFIG = ThemeConfig.create(_themeOptions);
  `);


  protected _componentUsageCode = signal(`<!-- Add to your template -->
    <ml-dark-mode-toggle-mat></ml-dark-mode-toggle-mat>
    <ml-theme-picker-mat></ml-theme-picker-mat>`);

    protected _scssCode = signal(`
// Custom Theming for Angular Material
@use "@angular/material" as mat;

// Import color overrides
@use "./overrides/mat-color-overrides.scss" as matColorOverrides;

// Fonts
$font-family: 'Roboto, "Helvetica Neue", sans-serif';

// Define typography
$custom-typography: (
  plain-family: Roboto,
  brand-family: Open Sans,
  bold-weight: 900,
  medium-weight: 500,
  regular-weight: 300,
);

// Angular Material v19 theme setup. This is still required for shapes, border-radius etc.
html {
  // Leave the color palette empty as we're handling colors via CSS variables using our theming system
  @include mat.theme((
    // typography: $custom-typography // Uncomment this line to use custom typography
  ));
}

body {
  margin: 0;
  font-family: $font-family;
}

// Include core styles - only needed once per application
@include mat.core();
      `);

}




