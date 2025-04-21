import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DarkModeToggleMatComponent, MlThemePickerMatComponent } from '@moonlight/material/theming/components';
import { DEFAULT_COLOR_TONES } from '@moonlight/material/theming/config';
import { MlThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';
import { ThemeBannerComponent } from '../../ui/banner/theme-banner.component';
@Component({
  selector: 'ml-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    DarkModeToggleMatComponent,
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

// Angular Material v19 theme setup This is still required for shapes, border-radius etc.
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




