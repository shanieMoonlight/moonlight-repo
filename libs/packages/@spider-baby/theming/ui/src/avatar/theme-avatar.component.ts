import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ThemeOption } from '@spider-baby/material-theming/config';

/**
 * A component that displays a theme as a visual avatar with color stripes.
 * 
 * The avatar displays the theme's primary, secondary, and tertiary colors as vertical stripes,
 * which can be rendered as a circle or square.
 * 
 * @example
 * ```html
 * <!-- Basic usage with a circular avatar -->
 * <sb-theme-avatar [theme]="myTheme"></sb-theme-avatar>
 * 
 * <!-- Square avatar -->
 * <sb-theme-avatar [theme]="myTheme" [isCircle]="false"></sb-theme-avatar>
 * ```
 */
@Component({
  selector: 'sb-theme-avatar',
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.borderRadius]': '_borderRadius()'
  },
  template: `
    <div class="stripe secondary-stripe" [style.background-color]="_theme().secondaryColor"></div>
    <div class="stripe primary-stripe" [style.background-color]="_theme().primaryColor"></div>
    <!-- Fallback for tertiary if it's null/undefined -->
    <div class="stripe tertiary-stripe" [style.background-color]="_theme().tertiaryColor ?? _theme().secondaryColor"></div>
  `,
  styles: `

  :host  {
    display: flex;
    width: 100%; /*  Fill the host */
    height: 100%; /* Fill the host*/
    overflow: hidden;    /* Clip the stripes to the circle */
  }

  .stripe {
    height: 100%; /* Fill height of the circular container */
  }

  /* Apply the 1:2:1 ratio for 25% / 50% / 25% */
  .stripe {
    &.primary-stripe { 
      flex: 2;
    }
    &.secondary-stripe { 
      flex: 1;
    }
    &.tertiary-stripe { 
      flex: 1;
    }
  }
  `
})
export class SbThemeAvatarComponent {

  /**
   * The theme to display in this avatar.
   * Required input that determines the colors shown in the stripes.
   */
 _theme = input.required<ThemeOption>({alias: 'theme'})
 
  /**
   * Whether to display the avatar as a circle (true) or square (false).
   * @default true
   */
_isCircle = input<boolean>(true, {alias: 'isCircle'});


  /**
   * Computed CSS border-radius value based on the isCircle input.
   */
 protected _borderRadius = computed(() => this._isCircle() ? '50%' : '0%');

}
