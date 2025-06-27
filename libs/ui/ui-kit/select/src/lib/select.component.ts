/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

//##########################//

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

//##########################//

@Component({
  selector: 'sb-select',
  standalone: true,
  imports: [NgClass],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbSelectComponent implements ControlValueAccessor {
  
  color = input<UiKitTheme>('primary');
  options = input<SelectOption[]>([]);
  placeholder = input<string>('');

  protected _value = signal<any>('');
  protected _disabled = signal(false);

  protected get _required(): boolean {
    return Boolean(this.parent?.control?.hasValidator(Validators.required));
  }

  constructor(@Self() @Optional() private parent?: NgControl) {
    if (this.parent) {
      this.parent.valueAccessor = this;
    }
  }

  setValue(event: Event) {
    if (this._disabled()) return;

    const select = event.target as HTMLSelectElement;
    const value = select.value === '' ? null : select.value;
    this._value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  // ControlValueAccessor methods
  onChange = (_: unknown) => {};
  onTouched = () => {};

  writeValue(val: any): void {
    this._value.set(val ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

}//Cls
