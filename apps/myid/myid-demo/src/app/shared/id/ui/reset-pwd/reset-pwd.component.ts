import { ChangeDetectionStrategy, Component, inject, input, Input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbInputStyleDirective } from '../../../ui/input/input.directive';
import { SbInputWithBtnDirective } from '../../../ui/input/input-with-btn.directive';
import { SbToggleIconButtonComponent } from '../../../ui/toggle-icon-button/toggle-icon-button.component';
import { FirstErrorDirective } from '../../../utils/forms/first-error.directive';
import { StrongPassword6WithSpecialRegx } from '../../utils/pwd-regexes';

//##########################//

export interface ResetPwdDto {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPwdForm {
  email: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

//##########################//

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl) {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (!newPassword || !confirmPassword) {
    return null;
  }

  return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'sb-reset-pwd-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    SbButtonComponent,
    SbInputStyleDirective,
    SbInputWithBtnDirective,
    SbToggleIconButtonComponent,
  ],
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbResetPwdFormComponent {

  private fb = inject(FormBuilder);

  resetPassword = output<ResetPwdDto>();

  showLables = input<boolean>(true);

  @Input('strongPassword') set strongPassword(strongPwd: boolean | RegExp | undefined | null) {
    setTimeout(() => {
      if (!strongPwd)
        this._form.controls.newPassword.setValidators([Validators.required])
      else if (strongPwd instanceof RegExp)
        this._form.controls.newPassword.setValidators([Validators.required, Validators.pattern(strongPwd)])
      else
        this._form.controls.newPassword.setValidators([Validators.required, Validators.pattern(StrongPassword6WithSpecialRegx)])
    }, 500)
  }

  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);

  protected _form: FormGroup<ResetPwdForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.pattern(StrongPassword6WithSpecialRegx)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  private static _count = 0;
  protected _idSuffix = `-${SbResetPwdFormComponent._count++}`;

  //- - - - - - - - - - - -//

  protected submit() {
    if (!this._form.valid)
      return;

    const dto: ResetPwdDto = {
      email: this._form.controls.email.value,
      newPassword: this._form.controls.newPassword.value,
      confirmPassword: this._form.controls.confirmPassword.value,
    };

    this.resetPassword.emit(dto);
  }

  protected onPasswordToggle = (hide: boolean) =>
    this.showPassword.set(!hide);

  protected onConfirmPasswordToggle = (hide: boolean) =>
    this.showConfirmPassword.set(!hide);
}
