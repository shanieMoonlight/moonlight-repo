/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

@Component({
  selector: 'sb-checkbox',
  standalone: true,
  imports: [NgClass],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: []
})
export class SbCheckboxComponent implements ControlValueAccessor {

  color = input<UiKitTheme>('primary');

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
