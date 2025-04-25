import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { MlThemeAvatarComponent } from "@spider-baby/material-theming/ui";

@Component({
  selector: 'sb-theme-picker',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MlThemeAvatarComponent
],
  template: `  
    <button mat-icon-button
      [matMenuTriggerFor]="themeMenu"
      [matTooltip]="'Current theme: ' + _currentTheme()?.label">
      <mat-icon aria-label="Change Component Theme">palette</mat-icon>
    </button>
    <mat-menu #themeMenu="matMenu" class="theme-menu">
      @for(theme of _themes(); track theme.value){
        <button
          mat-menu-item
          [class.selected]="theme.value === _currentTheme()?.value"
          (click)="_themeChange.emit(theme)">
          <mat-icon class="colors-icon" aria-hidden="true">
            <ml-theme-avatar [theme]="theme"/>
          </mat-icon>
          <span>{{ theme.label }}</span>
        </button>
      }
    </mat-menu>
  `
  ,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {

  _themes = input<ThemeOption[]>([], { alias: 'themes' })

  _currentTheme = input<ThemeOption | undefined>(undefined, { alias: 'currentTheme' })
  _themeChange = output<ThemeOption>({ alias: 'themeChange' })



}
