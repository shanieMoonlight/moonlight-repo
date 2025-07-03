import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[sbOutsideClick]',
  standalone: true
})
export class SbClickOutsideDirective {

  private _elementRef = inject(ElementRef);

  sbOutsideClick = output<void>();

  //---------------//

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: MouseEvent) {

    let path: EventTarget[] = [];
    if (event.composedPath) {
      path = event.composedPath() as EventTarget[];
    } else {
      // Fallback for browsers without composedPath
      let el = event.target as HTMLElement | null;
      while (el) {
        path.push(el);
        el = el.parentElement;
      }
    }

    if (!path.includes(this._elementRef.nativeElement))
      this.sbOutsideClick.emit();

  }

}
