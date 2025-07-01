import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

@Component({
  selector: 'sb-progress-bar',
  standalone: true,
  template: `
    <div class="sb-progress-bar-container">
      <div class="sb-progress-bar-track">
        <div class="sb-progress-bar-fill" 
             [style.width]="_fillWidth()">
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'color()',
    '[class.indeterminate]': 'mode() === "indeterminate"',
  },
})
export class SbProgressBarComponent {

  /** Value from 0 to 100 (only for determinate mode) */
  readonly value = input<number>(0);
  
  /** 'determinate' | 'indeterminate' */
  readonly mode = input<'determinate' | 'indeterminate'>('indeterminate');
  
  /** Any valid CSS color */
  readonly color = input<UiKitTheme>('primary'); // Default to Material blue

  protected _fillWidth = computed(() => this.mode() === 'determinate'
    ? this.value() + '%'
    : '100%'
  )
}
