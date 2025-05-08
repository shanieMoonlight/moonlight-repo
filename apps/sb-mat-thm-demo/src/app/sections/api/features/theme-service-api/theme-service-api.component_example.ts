import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { ThemeService } from '@spider-baby/material-theming/service';

@Component({
  selector: 'sb-theme-demo-tester',
  standalone: true,
  imports: [MatSelectModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="toggleDarkMode()">Toggle Dark Mode</button>

    <mat-form-field appearance="outline">
      <mat-label>Choose Component Theme</mat-label>
      <mat-select (valueChange)="changeTheme($event)">
        @for (theme of _dynamicThemes; track theme.value) {
          <mat-option [value]="theme">
            {{ theme.label }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>

  <mat-form-field appearance="outline">
      <mat-label>Choose System Theme</mat-label>
      <mat-select (valueChange)="changeTheme($event)">
        @for (theme of _allSystemThemes; track theme.value) {
          <mat-option [value]="theme">
            {{ theme.label }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>

  Current Global Theme: {{_themeService.currentTheme().value}}
  `
})
export class ThemeDemoBasicTesterComponent {
  protected _themeService = inject(ThemeService);

  _dynamicThemes = [
    ThemeOption.create({
      darkMode: 'system',
      label: 'SpecialTheme1',
      value: 'special-theme1',
      primaryColor: '#4682B4',
      secondaryColor: '#D2691E'
    }),
    ThemeOption.create({
      darkMode: 'system',
      label: 'SpecialTheme2',
      value: 'special-theme2',
      primaryColor: '#FB3640',
      secondaryColor: '#1976D2'
    }),
    //..Define your custom themes here
  ]

  _allSystemThemes = this._themeService.availableThemes()


  toggleDarkMode() {
    const isDark = this._themeService.isDarkMode();
    this._themeService.setDarkMode(isDark ? 'light' : 'dark');
  }


  changeTheme = (theme: ThemeOption) =>
    this._themeService.applyTheme(theme) //<--- set Dynamic theme. Specific element if you don't want to apply global theme

}