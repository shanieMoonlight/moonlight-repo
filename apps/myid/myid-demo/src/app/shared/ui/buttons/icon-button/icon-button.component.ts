import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IdTheme } from '../../theme.type';
import { SvgRendererComponent } from '../../svg/svg-renderer.component';

@Component({
  selector: 'sb-icon-button',
  standalone: true,
  imports: [
    NgClass,
    SvgRendererComponent
  ],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      class="sb-icon-btn"
      [ngClass]="color()">
      <ng-content/>
      @if (svgString(); as svg) {
        <sb-svg-renderer [svgString]="svg"/>
      }
    </button>
  `,
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbIconButtonComponent {

  disabled = input<boolean>(false);

  color = input<IdTheme>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  svgString = input<string>();

}
