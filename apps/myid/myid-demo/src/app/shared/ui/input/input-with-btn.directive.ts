import { AfterContentChecked, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { IdTheme } from '../theme.type';


@Directive({
  selector: '[sbInputWithBtn]',
})
export class SbInputWithBtnDirective implements AfterContentChecked {

  private _el = inject(ElementRef)
  private _renderer = inject(Renderer2)

  color = input<IdTheme>('primary');

  private _container = this._el.nativeElement as HTMLElement;


  /**
   *
   */
  constructor() {
    this._renderer.addClass(this._container, 'sb-input-with-btn-container');

    // Apply container styles from login.component.scss:54-66
    this._renderer.setStyle(this._container, 'position', 'relative');
    this._renderer.setStyle(this._container, 'display', 'flex');
    this._renderer.setStyle(this._container, 'align-items', 'center');
    this._renderer.setStyle(this._container, 'justify-content', 'space-between');
    this._renderer.setStyle(this._container, 'border-width', '1px');
    this._renderer.setStyle(this._container, 'border-color', 'var(--mat-sys-outline)');
    this._renderer.setStyle(this._container, 'border-style', 'solid');
    // this._renderer.setStyle(this._container, 'border', '1px solid var(--mat-sys-outline)');
    this._renderer.setStyle(this._container, 'transition', 'border-color 0.3s ease-in-out');
    this._renderer.setStyle(this._container, 'border-radius', '0.5rem');
    this._renderer.setStyle(this._container, 'padding-right', '1rem');

    this._renderer.listen(this._container, 'focusin', () => {
      this._renderer.setStyle(this._container, 'border-color', `var(--mat-sys-${this.color()})`);
    });

    this._renderer.listen(this._container, 'focusout', () => {
      this._renderer.setStyle(this._container, 'border-color', 'var(--mat-sys-outline)');
    });

  }


  ngAfterContentChecked(): void {
    // Find the inner input element (Wait for it to be rendered in ngAfterContentChecked)
    const inputElement = this._container.querySelector('input');

    if (inputElement) {
      this._renderer.setStyle(inputElement, 'all', 'unset');
      this._renderer.setStyle(inputElement, 'padding', '0.75rem 1rem');
      this._renderer.setStyle(inputElement, 'font-size', '1rem');
      this._renderer.setStyle(inputElement, 'border-radius', 'inherit');
      this._renderer.setStyle(inputElement, 'background-color', 'transparent');
      this._renderer.setStyle(inputElement, 'outline', 'none');
      this._renderer.setStyle(inputElement, 'flex', '1');
    }
  }




}
