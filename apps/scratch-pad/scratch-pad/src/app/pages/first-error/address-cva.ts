import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstErrorDirective } from '@spider-baby/utils-forms';

export interface AddressValue {
  street: string;
  city: string;
  postalCode: string;
}

@Component({
  selector: 'scratch-pad-address-cva',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, FirstErrorDirective],
  templateUrl: './address-cva.html',
  styleUrl: './address-cva.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressCvaComponent),
      multi: true,
    },
  ],
})
export class AddressCvaComponent implements ControlValueAccessor {
  private _destroyRef = inject(DestroyRef);
  private _fb = inject(FormBuilder);

  protected _form = this._fb.nonNullable.group({
    street: this._fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    city: this._fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    postalCode: this._fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
  });

  private _onChange: (value: AddressValue) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor() {
    this._form.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this._onChange(value as AddressValue));
  }

  writeValue(value: AddressValue | null): void {
    const fallback: AddressValue = { street: '', city: '', postalCode: '' };
    this._form.patchValue(value ?? fallback, { emitEvent: false });
  }

  registerOnChange(fn: (value: AddressValue) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this._form.disable({ emitEvent: false });
      return;
    }

    this._form.enable({ emitEvent: false });
  }

  protected markTouched(): void {
    this._onTouched();
  }
}
