import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IdTheme } from '../../theme.type';

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

  color = input<IdTheme>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');

}
