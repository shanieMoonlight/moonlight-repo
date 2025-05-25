// Material Design 3 integration example
export const MaterialDesign3Example = `import { Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/theming/service';

@Component({
  selector: 'app-material-showcase',
  template: \`
    <div class="material-showcase">
      <h2>Material Design 3 Integration</h2>
      
      <!-- Surface containers with M3 roles -->
      <div class="surface-container">
        <mat-card class="surface-card">
          <mat-card-header>
            <mat-card-title>Primary Surface</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>This card uses Material Design 3 surface colors</p>
            <button mat-fab color="primary">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Color roles demonstration -->
      <div class="color-roles">
        <div class="color-sample primary">Primary</div>
        <div class="color-sample secondary">Secondary</div>
        <div class="color-sample tertiary">Tertiary</div>
        <div class="color-sample error">Error</div>
      </div>
      
      <!-- Typography with M3 tokens -->
      <div class="typography-samples">
        <h1 class="display-large">Display Large</h1>
        <h2 class="headline-medium">Headline Medium</h2>
        <p class="body-large">Body large text with proper contrast</p>
        <p class="label-medium">Label Medium</p>
      </div>
    </div>
  \`,
  styles: [\`
    .surface-container {
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface);
      padding: 16px;
      border-radius: 12px;
      margin: 16px 0;
    }
    
    .color-sample {
      padding: 16px;
      margin: 8px;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }
    
    .color-sample.primary {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }
    
    .color-sample.secondary {
      background: var(--mat-sys-secondary);
      color: var(--mat-sys-on-secondary);
    }
    
    .color-sample.tertiary {
      background: var(--mat-sys-tertiary);
      color: var(--mat-sys-on-tertiary);
    }
    
    .color-sample.error {
      background: var(--mat-sys-error);
      color: var(--mat-sys-on-error);
    }
    
    .display-large {
      font-size: 57px;
      line-height: 64px;
      font-weight: 400;
      color: var(--mat-sys-on-surface);
    }
    
    .headline-medium {
      font-size: 28px;
      line-height: 36px;
      font-weight: 400;
      color: var(--mat-sys-on-surface);
    }
    
    .body-large {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      color: var(--mat-sys-on-surface);
    }
    
    .label-medium {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
    }
  \`]
})
export class MaterialShowcaseComponent {
  protected themeService = inject(ThemeService);
}`;

// Component integration examples
export const ComponentIntegrationExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-component-integration',
  template: \`
    <div class="integration-examples">
      <h2>Component Integration Examples</h2>
      
      <!-- Theme customizer component -->
      <div class="section">
        <h3>Theme Customizer</h3>
        <sb-theme-customizer
          [showDarkModeToggle]="true"
          [showThemeSelector]="true"
          [allowCustomThemes]="true">
        </sb-theme-customizer>
      </div>
      
      <!-- Theme toggle components -->
      <div class="section">
        <h3>Theme Toggle Components</h3>
        
        <!-- Simple dark mode toggle -->
        <sb-dark-mode-toggle></sb-dark-mode-toggle>
        
        <!-- Theme selector dropdown -->
        <sb-theme-selector></sb-theme-selector>
        
        <!-- Advanced theme controls -->
        <sb-theme-controls 
          [showPreview]="true"
          [enableTransitions]="true">
        </sb-theme-controls>
      </div>
      
      <!-- Showcase component for testing themes -->
      <div class="section">
        <h3>Theme Showcase</h3>
        <sb-theme-showcase
          [includeComponents]="['buttons', 'cards', 'forms', 'navigation']"
          [showColorPalette]="true">
        </sb-theme-showcase>
      </div>
    </div>
  \`
})
export class ComponentIntegrationComponent {}`;

// Complete application setup
export const CompleteSetupExample = `// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig);

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideThemeConfig, ThemeOption } from '@spider-baby/theming/config';

// Define your themes
const themes: ThemeOption[] = [
  ThemeOption.create({
    value: 'default',
    label: 'Default',
    primaryColor: '#6200ee',
    secondaryColor: '#03dac6',
    defaultDarkMode: 'system'
  }),
  ThemeOption.create({
    value: 'blue-theme',
    label: 'Ocean Blue',
    primaryColor: '#0277bd',
    secondaryColor: '#00acc1',
    tertiaryColor: '#0097a7',
    defaultDarkMode: 'system'
  }),
  ThemeOption.create({
    value: 'green-theme',
    label: 'Forest Green',
    primaryColor: '#2e7d32',
    secondaryColor: '#388e3c',
    tertiaryColor: '#43a047',
    defaultDarkMode: 'light'
  })
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([/* your routes */]),
    provideAnimations(),
    provideThemeConfig({
      themeOptions: themes,
      defaultDarkModeType: 'system',
      themeClassPrefix: 'app-theme',
      darkModeClass: 'dark-mode',
      lightModeClass: 'light-mode',
      transitionOptions: {
        duration: 500,
        easing: 'ease-in-out'
      }
    })
  ]
};

// app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '@spider-baby/theming/service';
import { RouterOutlet } from '@angular/router';
import { SbThemeCustomizerComponent } from '@spider-baby/theming/customizer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SbThemeCustomizerComponent],
  template: \`
    <div class="app-container">
      <header class="app-header">
        <h1>My Themed App</h1>
        <sb-theme-customizer></sb-theme-customizer>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  \`,
  styles: [\`
    .app-container {
      min-height: 100vh;
      background: var(--mat-sys-background);
      color: var(--mat-sys-on-background);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      box-shadow: var(--mat-sys-surface-tint) 0px 2px 4px;
    }
    
    .app-main {
      padding: 24px;
    }
  \`]
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  
  ngOnInit() {
    // Initialize theming
    console.log('Current theme:', this.themeService.currentTheme().label);
    console.log('Dark mode:', this.themeService.isDarkMode());
  }
}`;
