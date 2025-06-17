/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { IdTheme } from '../theme.type';

@Component({
  selector: 'sb-checkbox',
  standalone: true,
  imports: [NgClass],
  template: `
    <label class="sb-checkbox-label" [ngClass]="color()" [class.disabled]="_disabled()">
      <input
        type="checkbox"
        class="sb-checkbox-input"
        [checked]="_checked()"
        [disabled]="_disabled()"
        (change)="setValue($event)"
        (blur)="onTouched()"/>
      <div class="sb-checkbox-custom">
        <svg id="icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="currentColor">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
      </div>
      <ng-content/>      
      @if (_required){
        <span class="sb-checkbox-required">*</span>
      }
    </label>
  `,
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: []
})
export class SbCheckboxComponent implements ControlValueAccessor {

  color = input<IdTheme>('primary');

  protected _checked = signal(false);
  protected _disabled = signal(false);

  protected get _required(): boolean {
    return Boolean(this.parent?.control?.hasValidator(Validators.required))
  }

  //- - - - - - - - - - //

  constructor(@Self() @Optional() private parent?: NgControl) {
    if (this.parent)
      this.parent.valueAccessor = this
  }

  //- - - - - - - - - - //

  setValue(event: Event) {
    if (this._disabled())
      return;

    const input = event.target as HTMLInputElement;
    this._checked.set(input.checked);
    this.onChange(input.checked);
    this.onTouched();
  }

  //=======================//

  // ControlValueAccessor methods
  onChange = (_: unknown) => { };
  onTouched = () => { };

  writeValue(val: boolean): void {
    this._checked.set(!!val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log(`Setting disabled state to: ${isDisabled}`);
    this._disabled.set(isDisabled);
  }

  //=======================//

}//Cls
