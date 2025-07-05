import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'sb-button-icon-delete',
  standalone: true,
  imports: [SbIconButtonComponent],
  template: `
    <sb-icon-button
      [type]="'button'"
      [color]="color()"
      [disabled]="disabled()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
       <path xmlns="http://www.w3.org/2000/svg" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
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
export class SbButtonIconDeleteComponent {

  disabled = input<boolean>(false);

  color = input<UiKitTheme>('primary')

}
