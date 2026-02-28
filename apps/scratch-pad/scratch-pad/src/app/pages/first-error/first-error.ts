import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';

interface FirstErrorDemoForm {
  firstName: FormControl<string>;
  email: FormControl<string>;
  username: FormControl<string>;
  phoneNumber: FormControl<string>;
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
    FirstErrorComponent,
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
  });

  protected _showStateLabel = computed(() => (this.show() ? 'Hide extra controls' : 'Show extra controls'));

  toggleShow(): void {
    this.show.update((current) => !current);
  }

  submit(): void {
    this._form.updateValueAndValidity();
  }
}
