import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
      [ngClass]="color()"
      (click)="clicked.emit()">
      <ng-content/>
    </button>
  `,
  styleUrls: ['./text-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbTextButtonComponent {

  disabled = input<boolean>(false);
  clicked = output<void>();

  color = input<UiKitTheme>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');

}
