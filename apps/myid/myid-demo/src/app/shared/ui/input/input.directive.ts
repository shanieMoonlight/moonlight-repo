import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { IdTheme } from '../theme.type';

@Directive({
  selector: '[sbInputStyle]',
  standalone: true,
})
export class SbInputStyleDirective {
  
  private _el = inject(ElementRef)
  private _renderer = inject(Renderer2)

  color = input<IdTheme>('primary');
  
  private _input = this._el.nativeElement as HTMLInputElement;


  constructor() {
    this._renderer.addClass(this._input, 'sb-input');
    
    // Apply styles from login.component.scss:34-49
    this._renderer.setStyle(this._input, 'padding', '0.75rem 1rem');
    this._renderer.setStyle(this._input, 'border', '1px solid var(--mat-sys-outline)');
    this._renderer.setStyle(this._input, 'border-radius', '0.5rem');
    this._renderer.setStyle(this._input, 'font-size', '1rem');
    this._renderer.setStyle(this._input, 'transition', 'border-color 0.2s');
    this._renderer.setStyle(this._input, 'background-color', 'transparent');
    this._renderer.setStyle(this._input, 'color', 'inherit');
    
    // Add focus styles
    this._renderer.listen(this._input, 'focus', () => {
      this._renderer.setStyle(this._input, 'border', `1px solid var(--mat-sys-${this.color()})`);
      this._renderer.setStyle(this._input, 'outline', 'none');
    });
    
    this._renderer.listen(this._input, 'blur', () => {
      this._renderer.setStyle(this._input, 'border', '1px solid var(--mat-sys-outline)');
    });
  }



}
