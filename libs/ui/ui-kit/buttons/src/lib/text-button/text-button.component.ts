import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

@Component({
  selector: 'sb-text-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      class="sb-text-btn"
      [ngClass]="color()">
      <ng-content/>
    </button>
  `,
  styleUrls: ['./text-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbTextButtonComponent {

  disabled = input<boolean>(false);

  color = input<UiKitTheme>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');

}
