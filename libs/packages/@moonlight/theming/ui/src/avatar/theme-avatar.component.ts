import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ThemeOption } from '@moonlight/ng/theming/config';

@Component({
  selector: 'ml-theme-avatar',
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
    width: 100%; // Fill the host
    height: 100%; // Fill the host
    overflow: hidden;    // Clip the stripes to the circle
  }

  .stripe {
    height: 100%; // Fill height of the circular container
  }

  // Apply the 1:2:1 ratio for 25% / 50% / 25%
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
export class MlThemeAvatarComponent {

 _theme = input.required<ThemeOption>({alias: 'theme'})
_isCircle = input<boolean>(true, {alias: 'isCircle'});


 protected _borderRadius = computed(() => this._isCircle() ? '50%' : '0%');

}
