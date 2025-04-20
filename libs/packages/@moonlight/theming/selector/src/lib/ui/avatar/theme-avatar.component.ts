import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ThemeOption } from '@moonlight/ng/theming/config';

@Component({
  selector: 'ml-theme-avatar',
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="swatch secondary-swatch" [style.background-color]="_theme().secondaryColor"></div>
    <div class="swatch primary-swatch" [style.background-color]="_theme().primaryColor"></div>
    <!-- Fallback for tertiary if it's null/undefined -->
    <div class="swatch tertiary-swatch" [style.background-color]="_theme().tertiaryColor ?? _theme().secondaryColor"></div>
  `,
  styles: `

  :host  {
    display: flex;
    width: 100%; // Fill the host
    height: 100%; // Fill the host
    border-radius: 50%; // Make the container circular
    overflow: hidden;    // Clip the stripes to the circle
    border: 1px solid rgba(0, 0, 0, 0.1); // Optional: Border around the whole circle
  }

  .swatch {
    height: 100%; // Fill height of the circular container
  }

  // Apply the 1:2:1 ratio for 25% / 50% / 25%
  .swatch {
    &.primary-swatch { 
      flex: 2;
    }
    &.secondary-swatch { 
      flex: 1;
    }
    &.tertiary-swatch { 
      flex: 1;
    }
  }
  `
})
export class ThemeAvatarComponent {

 _theme = input.required<ThemeOption>({alias: 'theme'})

}
