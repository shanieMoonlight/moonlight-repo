import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstErrorDirective } from '@spider-baby/utils-forms';

interface FirstErrorDemoForm {
  firstName: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
  phoneNumber: FormControl<string>;
  aliases: FormArray<FormControl<string>>;
}

@Component({
  selector: 'scratch-pad-first-error',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FirstErrorDirective,
  ],
  templateUrl: './first-error.html',
  styleUrl: './first-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstErrorPage {
  private _fb = inject(FormBuilder);

  show = signal(false);

  protected _form: FormGroup<FirstErrorDemoForm> = this._fb.nonNullable.group({
    firstName: this._fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    email: this._fb.nonNullable.control('', [Validators.required, Validators.email]),
    username: this._fb.nonNullable.control('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]),
    phoneNumber: this._fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    aliases: this._fb.array<FormControl<string>>([
      this._fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    ]),
  });

  protected _showStateLabel = computed(() => (this.show() ? 'Hide extra controls' : 'Show extra controls'));

  protected get aliasesControls() {
    return this._form.controls.aliases.controls;
  }


  constructor() {

    this._form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      console.log('Form value changes:', value);
      console.log('Form errors aliases.controls[0]:', this._form.controls.aliases.controls[0].errors);
      console.log('Form errors Firstname:', this._form.controls.firstName.errors);
    });

  }

  toggleShow(): void {
    this.show.update((current) => !current);
  }

  addAlias(): void {
    this._form.controls.aliases.push(
      this._fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    );
  }

  removeLastAlias(): void {
    if (this._form.controls.aliases.length > 1)
      this._form.controls.aliases.removeAt(this._form.controls.aliases.length - 1);
  }

  submit(): void {
    this._form.updateValueAndValidity();
  }
}
