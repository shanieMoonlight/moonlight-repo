import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, signal, viewChild, ViewChild } from '@angular/core';
import { RippleComponent } from '@spider-baby/ui-kit/ripple';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SvgRendererComponent } from '@spider-baby/ui-kit/utils'

@Component({
  selector: 'sb-icon-button',
  standalone: true,
  imports: [
    NgClass,
    SvgRendererComponent,
    RippleComponent
  ],
  template: `
    <button
      #btn
      [type]="type()"
      [disabled]="disabled()"
      class="sb-icon-btn"
      [ngClass]="color()"
      (click)="showRipple()">
      <!-- <span class="sb-ripple" [class.active]="_rippleActive()"></span> -->
       <sb-ripple [color]="color()"/>
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

  protected _btn = viewChild.required<ElementRef<HTMLButtonElement>>('btn');
  protected _rippleActive = signal(false)

  showRipple() {
    this._rippleActive.set(false)
    // Force reflow to restart animation if needed
    void (this._btn().nativeElement.offsetWidth);
    this._rippleActive.set(true);
    setTimeout(() => {
      this._rippleActive.set(false)
    }, 350);
  }
}
