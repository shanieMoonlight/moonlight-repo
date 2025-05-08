import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { DarkModeType, ThemeOption } from '@spider-baby/material-theming/config';
import { ThemeService } from '@spider-baby/material-theming/service';

@Component({
  selector: 'sb-theme-local-demo-tester',
  standalone: true,
  imports: [MatSelectModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div #localThemeArea 
        class="themed-area" 
        style="background-color: var(--mat-sys-surface); color: var(--mat-sys-on-primary); border:1px solid red;">
        
        <h1 style="background-color: var(--mat-sys-primary); color: var(--mat-sys-on-primary);">This area has its own theme!</h1>
        
      </div>
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
  </div>

  Current Local Theme: {{_currentTheme.value}}
  `
})
export class ThemeDemoLocalTesterComponent {

  protected _themeService = inject(ThemeService);
  private _componentElementRef = inject(ElementRef);

  _dynamicThemes = [
    ThemeOption.create({
      darkMode: 'light',
      label: 'SpecialTheme1',
      value: 'special-theme1',
      primaryColor: '#4682B4',
      secondaryColor: '#D2691E',
    }),
    ThemeOption.create({
      darkMode: 'light',
      label: 'SpecialTheme2',
      value: 'special-theme2',
      primaryColor: '#FB3640',
      secondaryColor: '#1976D2'
    }),
    //..Define your custom themes here
  ]

  protected _allSystemThemes = this._themeService.availableThemes()

  protected _currentTheme = this._dynamicThemes[0]

  
  constructor() {
    this.changeTheme (this._currentTheme)    
  }


  toggleDarkMode() {
    const newDarkMode :DarkModeType= this._currentTheme.darkMode === 'dark' ? 'light' : 'dark';
    const newTheme = { ...this._currentTheme, darkMode: newDarkMode }
    this.changeTheme(newTheme); // Apply the theme change
  }


  changeTheme = (theme: ThemeOption) => {
    this._currentTheme = theme; // Update the current theme
    return this._themeService.applyTheme(theme, this._componentElementRef.nativeElement) //<--- Set Dynamic theme to the specific element
  }

}