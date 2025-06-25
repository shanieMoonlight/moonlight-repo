import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IdTheme } from '../../theme.type';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'sb-button-icon-close',
  standalone: true,
  imports: [SbIconButtonComponent],
  template: `
    <sb-icon-button
      [type]="'button'"
      [disabled]="disabled()">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
      </svg>
    </sb-icon-button>
  `,
  styleUrls: ['./button-close.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonIconCloseComponent {

  disabled = input<boolean>(false);

  color = input<IdTheme>('primary')

}
