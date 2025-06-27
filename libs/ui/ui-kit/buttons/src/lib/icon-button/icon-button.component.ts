import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SvgRendererComponent } from '@spider-baby/ui-kit/utils'

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

  color = input<UiKitTheme>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  svgString = input<string>();

}
