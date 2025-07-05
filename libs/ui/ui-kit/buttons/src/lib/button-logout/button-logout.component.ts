import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'sb-button-icon-logout',
  standalone: true,
  imports: [SbIconButtonComponent],
  template: `
    <sb-icon-button
      [type]="'button'"
      [color]="color()"
      [disabled]="disabled()">
      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
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
export class SbButtonIconLogoutComponent {

  disabled = input<boolean>(false);

  color = input<UiKitTheme>('primary')

}
