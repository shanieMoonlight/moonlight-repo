import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'sb-button-icon-close',
  standalone: true,
  imports: [SbIconButtonComponent],
  template: `
    <sb-icon-button
      [type]="'button'"
      [color]="color()"
      [disabled]="disabled()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
      </svg>
    </sb-icon-button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonIconCloseComponent {

  disabled = input<boolean>(false);

  color = input<UiKitTheme>('primary')

}
