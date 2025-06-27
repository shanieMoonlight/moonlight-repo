import { Directive, ElementRef, HostListener, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[sbTooltip]',
  standalone: true,
})
export class SbTooltipDirective {

  private _el = inject(ElementRef)
  private _renderer = inject(Renderer2)

  @Input('sbTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  private _tooltipElement: HTMLElement | null = null;


  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this._tooltipElement)
      this.showTooltip()
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  //-------------------//

  private showTooltip() {
    this._tooltipElement = this._renderer.createElement('span');

    if (!this._tooltipElement || !this.tooltipText?.trim())
      return

    this._tooltipElement.innerText = this.tooltipText;
    this._renderer.addClass(this._tooltipElement, 'sb-tooltip');
    this._renderer.addClass(this._tooltipElement, `sb-tooltip-${this.tooltipPosition}`);
    this.setShowStyles();


    // Positioning
    const hostPos = this._el.nativeElement.getBoundingClientRect();
    this._renderer.appendChild(document.body, this._tooltipElement);
    const tooltipPos = this._tooltipElement.getBoundingClientRect();

    let top = 0, left = 0;
    switch (this.tooltipPosition) {
      case 'top':
        top = hostPos.top - tooltipPos.height - 8;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = hostPos.bottom + 8;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'left':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left - tooltipPos.width - 8;
        break;
      case 'right':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + 8;
        break;
    }

    this._renderer.setStyle(this._tooltipElement, 'top', `${top}px`);
    this._renderer.setStyle(this._tooltipElement, 'left', `${left}px`);

    this.animate();
  }

  //-------------------//

  animate() {
    // Trigger fade-in
    this._renderer.setStyle(this._tooltipElement, 'transition', '.5s');
    setTimeout(() => {
      if (this._tooltipElement) {
        this._renderer.setStyle(this._tooltipElement, 'transform', 'translateY(0)');
        this._renderer.setStyle(this._tooltipElement, 'opacity', '0.97');
      }
    }, 10);

  }

  //-------------------//

  private setShowStyles() {
    if (!this._tooltipElement)
      return;

    this._renderer.setStyle(this._tooltipElement, 'position', 'absolute');
    this._renderer.setStyle(this._tooltipElement, 'background', 'var(--mat-sys-inverse-surface, #312e2e)');
    this._renderer.setStyle(this._tooltipElement, 'color', 'var(--mat-sys-inverse-on-surface, whitesmoke)');
    this._renderer.setStyle(this._tooltipElement, 'padding', '6px 12px');
    this._renderer.setStyle(this._tooltipElement, 'borderRadius', '4px');
    this._renderer.setStyle(this._tooltipElement, 'boxShadow', '0 2px 8px rgba(0,0,0,0.15)');
    this._renderer.setStyle(this._tooltipElement, 'fontSize', '14px');
    this._renderer.setStyle(this._tooltipElement, 'pointerEvents', 'none');
    this._renderer.setStyle(this._tooltipElement, 'zIndex', '1000');
    this._renderer.setStyle(this._tooltipElement, 'overflow', 'hidden');
    this._renderer.setStyle(this._tooltipElement, 'opacity', '0');
    this._renderer.setStyle(this._tooltipElement, 'transform', 'translateY(10px)')
  }

  //-------------------//

  private hideTooltip() {
    if (this._tooltipElement) {
      this._renderer.removeChild(document.body, this._tooltipElement);
      this._tooltipElement = null;
    }
  }

}//Cls