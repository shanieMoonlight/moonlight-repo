import { Component, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '@moonlight/material/theming/service';
import { ThemeDemoCardComponent, ThemeDemoConfig } from './ui/theme-demo-card/theme-demo-card.component';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'ml-multi-theme-demo',
  standalone: true,
  imports: [
    MatDividerModule,
    ThemeDemoCardComponent,
    MatCardModule
  ],
  templateUrl: './mutli-theme-demo.component.html',
  styleUrl: './multi-theme-demo.component.scss'
})
export class MultiThemeApiDemoComponent {
  themeService = inject(ThemeService);
  progressValue = 60;

  demoCards: ThemeDemoConfig[] = [
    {
      title: 'Theme Selection',
      subtitle: 'Using setThemeByValue method',
      type: 'buttons',
      codeExample: '// Change theme by value\nthemeService.setThemeByValue(\'ocean-blue\');'
    },
    {
      title: 'Button Showcase',
      subtitle: 'See theme changes in real-time',
      type: 'buttons',
      codeExample: '// Material components automatically use theme colors\n<button mat-raised-button color="primary">Primary</button>\n<button mat-raised-button color="accent">Accent</button>'
    },
    {
      title: 'Current Theme Details',
      subtitle: 'Accessing theme properties',
      type: 'info',
      codeExample: '// Access current theme\nconst theme = themeService.currentTheme();\nconst isDark = themeService.isDarkMode();'
    },
    {
      title: 'Quick Actions',
      subtitle: 'Apply common theme operations',
      type: 'actions',
      codeExample: '// Common operations\nthemeService.setDarkMode(!themeService.isDarkMode());\nthemeService.resetToDefaults();'
    }
  ]

  _demoDescription = signal(`
  This demo showcases the ThemeGeneratorService API.
  Each card applies its theme only to itself and its children—without affecting the rest of the app.
  You can change themes, toggle dark mode, and reset to defaults, all scoped to a single card.
    `)
  _demoSubDescription = signal(`
      This approach is ideal for complex websites or applications where different sections, widgets, or embedded components require independent theming. 
      For example, you can safely preview or apply custom themes to specific cards, dashboards, or micro-frontends without impacting the global look and feel of the rest of your site.
    `);

_codeExample = signal(`
  private applyLocalTheme(localTheme: ThemeOption) {
    this.themeGenerator.applyTheme(
      localTheme,
      // \`\${this.componentThemeClassPrefix}-\${localTheme.value}\`,
      this.componentElementRef.nativeElement // Apply theme just to this component only
    );
  }  
`);

}