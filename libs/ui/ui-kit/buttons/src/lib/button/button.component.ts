import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

@Component({
  selector: 'sb-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      class="sb-btn"
      [ngClass]="color()">
      <ng-content/>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonComponent {

  disabled = input<boolean>(false);

  color = input<UiKitTheme>('primary')
  type = input<'button' | 'submit' | 'reset'>('button');


}
