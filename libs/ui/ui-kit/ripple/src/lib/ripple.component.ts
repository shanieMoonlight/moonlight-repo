import { ChangeDetectionStrategy, Component, HostListener, input, signal } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

@Component({
  selector: 'sb-ripple',
  standalone: true,
  imports: [],
  template: '<span class="sb-ripple"></span>',
  styleUrl: './ripple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'color()',
    '[class.active]': '_rippleActive()'
  },
})
export class RippleComponent {

  color = input<UiKitTheme>('error');

  protected _rippleActive = signal(false)
  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {

    if (event.button !== 0)
      return
    console.log('Host element clicked with event:', event);
    this._rippleActive.set(true);

    setTimeout(() => {
      this._rippleActive.set(false)
    }, 350);
  }

}
