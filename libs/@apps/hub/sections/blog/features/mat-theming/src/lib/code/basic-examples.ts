// Installation examples
export const InstallationExample = `# Install the package
npm install @spider-baby/theming

# Or with yarn
yarn add @spider-baby/theming`;

// Basic setup example
export const BasicSetupExample = `import { ApplicationConfig } from '@angular/core';
import { provideThemeConfig, ThemeOption } from '@spider-baby/theming/config';

// Define your application themes
const appThemes: ThemeOption[] = [
  ThemeOption.create({
    value: 'ocean-blue',
    label: 'Ocean Blue',
    primaryColor: '#0d47a1',
    secondaryColor: '#00bcd4',
    defaultDarkMode: 'system'
  }),
  ThemeOption.create({
    value: 'sunset-orange',
    label: 'Sunset Orange',
    primaryColor: '#ff6f00',
    secondaryColor: '#f44336',
    defaultDarkMode: 'light'
  })
];

export const appConfig: ApplicationConfig = {
  providers: [
    // Your other providers...
    provideThemeConfig({
      themeOptions: appThemes,
      defaultDarkModeType: 'system',
      themeClassPrefix: 'theme'
    })
  ]
};`;

// Basic theme service usage
export const BasicThemeServiceExample = `import { Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/theming/service';

@Component({
  selector: 'app-theme-controls',
  template: \`
    <div class="theme-controls">
      <h3>Current Theme: {{ themeService.currentTheme().label }}</h3>
      <p>Dark Mode: {{ themeService.isDarkMode() ? 'Enabled' : 'Disabled' }}</p>
      
      <button mat-button (click)="toggleDarkMode()">
        Toggle Dark Mode
      </button>
      
      <mat-select [value]="themeService.currentTheme().value" 
                  (selectionChange)="setTheme($event.value)">
        @for (theme of themeService.availableThemes(); track theme.value) {
          <mat-option [value]="theme.value">{{ theme.label }}</mat-option>
        }
      </mat-select>
    </div>
  \`
})
export class ThemeControlsComponent {
  protected themeService = inject(ThemeService);
  
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  
  setTheme(themeValue: string) {
    this.themeService.setThemeByValue(themeValue);
  }
}`;

// Custom theme creation example
export const CustomThemeExample = `import { Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/theming/service';
import { ThemeOption } from '@spider-baby/theming/config';

@Component({
  selector: 'app-custom-theme-creator',
  template: \`
    <div class="custom-theme-form">
      <h3>Create Custom Theme</h3>
      
      <mat-form-field>
        <mat-label>Theme Name</mat-label>
        <input matInput [(ngModel)]="themeName" placeholder="My Custom Theme">
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>Primary Color</mat-label>
        <input matInput type="color" [(ngModel)]="primaryColor">
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>Secondary Color</mat-label>
        <input matInput type="color" [(ngModel)]="secondaryColor">
      </mat-form-field>
      
      <button mat-raised-button color="primary" (click)="createTheme()">
        Create Theme
      </button>
    </div>
  \`
})
export class CustomThemeCreatorComponent {
  private themeService = inject(ThemeService);
  
  themeName = '';
  primaryColor = '#6200ee';
  secondaryColor = '#03dac6';
  
  createTheme() {
    if (!this.themeName) return;
    
    const customTheme = ThemeOption.create({
      value: this.themeName.toLowerCase().replace(/\\s+/g, '-'),
      label: this.themeName,
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      defaultDarkMode: 'system'
    });
    
    this.themeService.addCustomTheme(customTheme);
    this.themeService.setTheme(customTheme);
  }
}`;
