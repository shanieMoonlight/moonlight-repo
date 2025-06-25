import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IdTheme } from '../../theme.type';

@Component({
  selector: 'sb-icon-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      class="sb-icon-btn"
      [ngClass]="color()">
      <ng-content/>
    </button>
  `,
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbIconButtonComponent {

  disabled = input<boolean>(false);

  color = input<IdTheme>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');

}
