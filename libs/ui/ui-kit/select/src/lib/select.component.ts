/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, Optional, Self, signal, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbClickOutsideDirective } from '@spider-baby/ui-utils';

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
  imports: [
    NgClass,
    CommonModule,
    SbClickOutsideDirective
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.disabled]": "_disabled()",
    "[class.readonly]": "readonly()"
  }
})
export class SbSelectComponent implements ControlValueAccessor {

  color = input<UiKitTheme>('primary');
  options = input<SelectOption[]>([]);
  readonly = input(false);
  placeholder = input<string>('');
  optionTemplate = input<TemplateRef<unknown> | undefined>(undefined);

  protected _isOpen = false;
  protected _selectedOption = signal<SelectOption | undefined>(undefined);

  protected _value = signal<any>('');
  protected _disabled = signal(false);


  protected get _required(): boolean {
    return Boolean(this.parent?.control?.hasValidator(Validators.required));
  }

  //- - - - - - - - - - - - -//

  constructor(@Self() @Optional() private parent?: NgControl) {

    if (this.parent)
      this.parent.valueAccessor = this;

    effect(() => {
      if (this._disabled() || this.readonly()) 
        this._isOpen = false
    })
  }

  //-------------------------//


  protected toggleDropdown() {
    console.log("Toggle Dropdown", this._isOpen, this._disabled(), this.readonly());
    
    if (this._disabled() || this.readonly())
      return;
    console.log("Toggle Dropdown", this._isOpen, this._disabled(), this.readonly());

    return this._isOpen = !this._isOpen;
  }


  protected selectOption(option?: SelectOption) {

    this._isOpen = false;     
    
    if (option?.disabled)
      return;
    
    this._selectedOption.set(option);
    const value = !option?.value ? null : option.value;

    this._value.set(value);

    this.onChange(value);
    this.onTouched();
  }

  onOutsideClick = () => 
    {
      console.log("Outside Click", this._isOpen, this._disabled(), this.readonly())
      
      return this._isOpen = false;
    }

  //-------------------------//

  // ControlValueAccessor methods
  onChange = (_: unknown) => { };
  onTouched = () => { };

  writeValue(val: any): void {
    const opts = this.options();
    const selectedOption = opts.find(opt => opt.value === val) ?? undefined;
    this.selectOption(selectedOption)
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
