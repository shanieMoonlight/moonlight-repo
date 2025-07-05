import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Renderer2, inject, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

@Component({
  selector: 'sb-ripple',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './ripple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'color()',
  },
})
export class RippleComponent {
 
  private el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>)
  private renderer = inject(Renderer2)

  
  color = input<UiKitTheme>('primary');


  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {

    if (event.button !== 0)
      return;
    
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'sb-ripple');
    const size = Math.max(rect.width, rect.height) * 2;
    
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.appendChild(host, ripple);
    // Force reflow to enable transition
    void ripple.offsetWidth;
    this.renderer.addClass(ripple, 'active');
    setTimeout(() => {
      this.renderer.removeChild(host, ripple);
    }, 400);
  }
}
