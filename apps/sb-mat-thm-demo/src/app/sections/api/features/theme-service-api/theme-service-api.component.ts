import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-api-theme-service-api',
  templateUrl: './theme-service-api.component.html',
  styleUrls: ['./theme-service-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTabsModule,
    HighlightModule
  ],
  providers: []
})
export class ThemeServiceApiComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata specific to the Theme Service API page
    this._seoService.updateMetadata({
      title: 'Theme Service API - SpiderBaby Material Theming',
      description: 'Comprehensive documentation for the SpiderBaby ThemeService API. Learn how to manipulate themes, toggle dark mode, and create custom themes for Angular Material.',
      url: this._router.url,
    });

  }

  // Property examples
  currentThemeExample = `// Access the current theme as a signal
const theme = themeService.currentTheme();
console.log(theme.label); // e.g. "Material Light"`;

  currentThemeObservableExample = `// Subscribe to theme changes
themeService.currentTheme$.subscribe(theme => {
  console.log('Theme changed:', theme.label);
});`;

  isDarkModeExample = `// Check if dark mode is active
const isDark = themeService.isDarkMode();
console.log('Dark mode is:', isDark ? 'on' : 'off');`;

  availableThemesExample = `// Get all available themes
const themes = themeService.availableThemes();
console.log(\`\${themes.length} themes available\`);`;

  // Method examples
  setThemeExample = `// Set a theme using a ThemeOption object
const myTheme = themeService.availableThemes().find(t => t.label === 'Ocean Blue');
if (myTheme) {
  themeService.setTheme(myTheme);
}`;

  setThemeByValueExample = `// Set a theme by its value
const success = themeService.setThemeByValue('material-light');
if (success) {
  console.log('Theme applied successfully');
} else {
  console.warn('Theme not found');
}`;

  setDarkModeExample = `// Set dark mode explicitly
themeService.setDarkMode('dark');

// Follow system preference
themeService.setDarkMode('system');

// Set light mode
themeService.setDarkMode('light');`;

  applyThemeExample = `// Apply theme to a specific element
const cardElement = document.querySelector('.my-card');
const myTheme = themeService.currentTheme();
themeService.applyTheme(myTheme, cardElement);`;

  applyThemeByValueExample = `// Apply theme to a specific element by value
const cardElement = document.querySelector('.my-card');
themeService.applyThemeByValue('material-light', cardElement);`;

  addCustomThemeExample = `// Create and add a custom theme
import { ThemeOption } from '@spider-baby/material-theming/config';

const myCustomTheme = ThemeOption.create({
  value: 'custom-purple',
  label: 'Purple Theme',
  primaryColor: '#6200EA',
  secondaryColor: '#03DAC6'
});

themeService.addCustomTheme(myCustomTheme);`;

  removeCustomThemeExample = `// Remove a custom theme
themeService.removeCustomTheme('custom-purple');`;

  reapplyCurrentThemeExample = `// In a component that temporarily previews themes
ngOnDestroy() {
  // Restore the application's theme when this component is destroyed
  this.themeService.reapplyCurrentTheme();
}`;

  resetToDefaultsExample = `// Reset everything to defaults
themeService.resetToDefaults();`;

  exportThemeSettingsExample = `// Export settings for sharing or saving
const settings = themeService.exportThemeSettings();
console.log(settings);
// Example output: { theme: {...}, isDark: true }`;

  // Complete usage examples
  basicUsageExample = `import { Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/material-theming/service';

@Component({
  selector: 'app-theme-demo',
  template: \`
    <button (click)="toggleDarkMode()">Toggle Dark Mode</button>
    <button (click)="applyTheme('material-indigo')">Apply Indigo Theme</button>
  \`
})
export class ThemeDemoComponent {
  private themeService = inject(ThemeService);
  
  toggleDarkMode() {
    const isDark = this.themeService.isDarkMode();
    this.themeService.setDarkMode(isDark ? 'light' : 'dark');
  }
  
  applyTheme(themeValue: string) {
    this.themeService.setThemeByValue(themeValue);
  }
}`;

  localThemingExample = `import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ThemeService } from '@spider-baby/material-theming/service';

@Component({
  selector: 'app-local-theme-demo',
  template: \`
    <div class="container">
      <div #localThemeArea class="themed-area">
        This area has its own theme!
      </div>
      <button (click)="applyLocalTheme('material-purple')">Purple</button>
      <button (click)="applyLocalTheme('material-teal')">Teal</button>
    </div>
  \`
})
export class LocalThemeDemoComponent {
  private themeService = inject(ThemeService);
  @ViewChild('localThemeArea') themeArea!: ElementRef;
  
  applyLocalTheme(themeValue: string) {
    // Apply theme only to the specific element
    this.themeService.applyThemeByValue(themeValue, this.themeArea.nativeElement);
  }
}`;

  customThemesExample = `import { Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/material-theming/service';
import { ThemeOption } from '@spider-baby/material-theming/config';

@Component({
  selector: 'app-custom-theme-demo',
  template: \`
    <button (click)="createCustomTheme()">Create Custom Theme</button>
    <button (click)="applyCustomTheme()" [disabled]="!hasCustomTheme">Apply Custom Theme</button>
  \`
})
export class CustomThemeDemoComponent {
  private themeService = inject(ThemeService);
  
  get hasCustomTheme(): boolean {
    return this.themeService.customThemes().some(t => t.value === 'custom-sunset');
  }
  
  createCustomTheme() {
    const customTheme = ThemeOption.create({
      value: 'custom-sunset',
      label: 'Sunset Theme',
      primaryColor: '#FF5722',
      secondaryColor: '#FFC107',
      tertiaryColor: '#795548'
    });
    
    this.themeService.addCustomTheme(customTheme);
  }
  
  applyCustomTheme() {
    this.themeService.setThemeByValue('custom-sunset');
  }
}`;
}