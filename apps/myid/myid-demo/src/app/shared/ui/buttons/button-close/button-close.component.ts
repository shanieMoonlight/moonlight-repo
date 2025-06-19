import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SbTextButtonComponent } from '../text-button/text-button.component';
import { IdTheme } from '../../theme.type';

@Component({
  selector: 'sb-button-icon-close',
  standalone: true,
  imports: [SbTextButtonComponent],
  template: `
    <sb-text-button
      [type]="'button'"
      [disabled]="disabled()"
      (click)="clicked.emit()">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
      </svg>
    </sb-text-button>
  `,
  styleUrls: ['./button-close.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonIconCloseComponent {

  disabled = input<boolean>(false);
  clicked = output<void>()

  color = input<IdTheme>('primary')

}
