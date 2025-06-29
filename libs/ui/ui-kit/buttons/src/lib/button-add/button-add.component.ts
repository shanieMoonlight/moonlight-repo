import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'sb-button-icon-add',
  standalone: true,
  imports: [SbIconButtonComponent],
  template: `
    <sb-icon-button
      [type]="'button'"
      [disabled]="disabled()">
      @if (circle()) {
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
      }
    </sb-icon-button>
  `,
  styleUrls: ['./button-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonIconAddComponent {

  disabled = input<boolean>(false);

  color = input<UiKitTheme>('primary')
  circle = input(false)

}
