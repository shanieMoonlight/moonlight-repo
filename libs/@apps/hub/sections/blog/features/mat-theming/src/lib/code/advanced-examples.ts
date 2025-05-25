// Dynamic theme configuration example
export const DynamicThemeConfigExample = `import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@spider-baby/theming/config';

@Component({
  selector: 'app-feature-section',
  template: \`<router-outlet></router-outlet>\`
})
export class FeatureSectionComponent implements OnInit, OnDestroy {
  private dynamicConfig = inject(DynamicThemeConfigService);
  
  ngOnInit() {
    // Set section-specific themes
    this.dynamicConfig.setSystemThemes([
      ThemeOption.create({
        value: 'feature-blue',
        label: 'Feature Blue',
        primaryColor: '#2196f3',
        secondaryColor: '#ff9800'
      }),
      ThemeOption.create({
        value: 'feature-green',
        label: 'Feature Green',
        primaryColor: '#4caf50',
        secondaryColor: '#e91e63'
      })
    ]);
  }
  
  ngOnDestroy() {
    // Reset to application-wide themes when leaving this section
    this.dynamicConfig.resetSystemThemesToInitial();
  }
}`;

// Theme generator service usage
export const ThemeGeneratorExample = `import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ThemeGeneratorService } from '@spider-baby/theming/service';
import { ThemeOption } from '@spider-baby/theming/config';

@Component({
  selector: 'app-theme-preview',
  template: \`
    <div class="preview-controls">
      <button mat-button (click)="previewTheme(oceanTheme)">
        Preview Ocean Theme
      </button>
      <button mat-button (click)="previewTheme(sunsetTheme)">
        Preview Sunset Theme
      </button>
      <button mat-button (click)="resetToGlobal()">
        Reset to Global Theme
      </button>
    </div>
    
    <div #previewContainer class="theme-preview">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Theme Preview</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>This content shows the applied theme colors.</p>
          <button mat-raised-button color="primary">Primary Button</button>
          <button mat-raised-button color="accent">Accent Button</button>
        </mat-card-content>
      </mat-card>
    </div>
  \`
})
export class ThemePreviewComponent {
  @ViewChild('previewContainer') container!: ElementRef;
  private themeGenerator = inject(ThemeGeneratorService);
  
  oceanTheme = ThemeOption.create({
    value: 'ocean-preview',
    label: 'Ocean Preview',
    primaryColor: '#0277bd',
    secondaryColor: '#00acc1'
  });
  
  sunsetTheme = ThemeOption.create({
    value: 'sunset-preview',
    label: 'Sunset Preview',
    primaryColor: '#ff8f00',
    secondaryColor: '#f57c00'
  });
  
  previewTheme(theme: ThemeOption) {
    // Apply theme only to this component's container
    this.themeGenerator.applyTheme(
      theme,
      undefined,
      this.container.nativeElement
    );
  }
  
  resetToGlobal() {
    // Reset by applying no specific theme to container
    // Global theme will be inherited
    this.container.nativeElement.style.cssText = '';
  }
}`;

// Hierarchical theming example
export const HierarchicalThemingExample = `import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@spider-baby/theming/config';

@Component({
  selector: 'app-admin-panel',
  template: \`
    <div class="admin-panel">
      <h2>Admin Panel</h2>
      <p>This section has its own theme context</p>
      <!-- Theme selector will show only admin themes -->
      <sb-theme-customizer></sb-theme-customizer>
    </div>
  \`
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private themeConfig = inject(DynamicThemeConfigService);
  
  ngOnInit() {
    // Create admin-specific themes
    const adminThemes = [
      ThemeOption.create({
        value: 'admin-dark',
        label: 'Admin Dark',
        primaryColor: '#37474f',
        secondaryColor: '#546e7a',
        defaultDarkMode: 'dark'
      }),
      ThemeOption.create({
        value: 'admin-professional',
        label: 'Professional',
        primaryColor: '#1565c0',
        secondaryColor: '#0277bd',
        defaultDarkMode: 'light'
      })
    ];
    
    this.themeConfig.setSystemThemes(adminThemes);
  }
  
  ngOnDestroy() {
    // Restore original themes when leaving admin section
    this.themeConfig.resetSystemThemesToInitial();
  }
}`;

// SCSS export example
export const ScssExportExample = `import { Component, inject } from '@angular/core';
import { ThemeGeneratorService } from '@spider-baby/theming/service';
import { ThemeService } from '@spider-baby/theming/service';

@Component({
  selector: 'app-theme-exporter',
  template: \`
    <div class="theme-exporter">
      <h3>Export Current Theme as SCSS</h3>
      <button mat-raised-button (click)="exportTheme()">
        Export Theme
      </button>
      
      @if (scssContent) {
        <div class="scss-output">
          <h4>Generated SCSS:</h4>
          <pre><code>{{ scssContent }}</code></pre>
          <button mat-button (click)="copyToClipboard()">
            Copy to Clipboard
          </button>
        </div>
      }
    </div>
  \`
})
export class ThemeExporterComponent {
  private themeService = inject(ThemeService);
  private themeGenerator = inject(ThemeGeneratorService);
  
  scssContent = '';
  
  exportTheme() {
    const currentTheme = this.themeService.currentTheme();
    this.scssContent = this.themeGenerator.exportThemeAsScss(currentTheme);
  }
  
  copyToClipboard() {
    navigator.clipboard.writeText(this.scssContent);
  }
}`;

// Theme transitions example
export const ThemeTransitionsExample = `import { Component, inject } from '@angular/core';
import { ThemeTransitionService } from '@spider-baby/theming/service';
import { ThemeService } from '@spider-baby/theming/service';
import { ThemeOption } from '@spider-baby/theming/config';

@Component({
  selector: 'app-smooth-theme-switcher',
  template: \`
    <div class="theme-switcher">
      <h3>Smooth Theme Transitions</h3>
      
      <div class="transition-controls">
        <button mat-raised-button (click)="switchWithOverlay()">
          Overlay Transition
        </button>
        
        <button mat-raised-button (click)="switchWithMorph()">
          Morph Transition
        </button>
        
        <button mat-raised-button (click)="switchInstant()">
          Instant Switch
        </button>
      </div>
    </div>
  \`
})
export class SmoothThemeSwitcherComponent {
  private themeService = inject(ThemeService);
  private transitions = inject(ThemeTransitionService);
  
  private themes = [
    ThemeOption.create({
      value: 'ocean',
      label: 'Ocean',
      primaryColor: '#0277bd',
      secondaryColor: '#00acc1'
    }),
    ThemeOption.create({
      value: 'forest',
      label: 'Forest',
      primaryColor: '#388e3c',
      secondaryColor: '#689f38'
    })
  ];
  
  switchWithOverlay() {
    const nextTheme = this.getNextTheme();
    
    this.transitions.transitionWithOverlay(
      () => this.themeService.setTheme(nextTheme),
      {
        duration: 800,
        easing: 'ease-in-out',
        overlayColor: nextTheme.primaryColor
      }
    );
  }
  
  switchWithMorph() {
    const nextTheme = this.getNextTheme();
    
    this.transitions.transitionWithMorph(
      () => this.themeService.setTheme(nextTheme),
      {
        duration: 600,
        morphStyle: 'circular'
      }
    );
  }
  
  switchInstant() {
    const nextTheme = this.getNextTheme();
    this.themeService.setTheme(nextTheme);
  }
  
  private getNextTheme(): ThemeOption {
    const current = this.themeService.currentTheme();
    const currentIndex = this.themes.findIndex(t => t.value === current.value);
    return this.themes[(currentIndex + 1) % this.themes.length];
  }
}`;
