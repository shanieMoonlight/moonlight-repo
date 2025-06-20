import { ChangeDetectionStrategy, Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbToggleIconButtonComponent } from '../../../../ui/buttons';
import { SbInputWithBtnDirective } from '../../../../ui/input/input-with-btn.directive';
import { PasswordValidation } from '../utils/validators/password-validators';

//##########################//

export interface ResetPwdFormDto {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPwdForm {
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

//##########################//

@Component({
  selector: 'sb-reset-pwd-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputWithBtnDirective,
    SbToggleIconButtonComponent,
  ],
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbResetPwdFormComponent {

  private fb = inject(FormBuilder);

  //- - - - - - - - - - - -//

  resetPassword = output<ResetPwdFormDto>();

  showLables = input<boolean>(true);
  disabled = input<boolean>(true);

  @Input()
  set passwordValidators(validators: ValidatorFn[] | undefined | null) {
    setTimeout(() => {
      if (!validators?.length)
        this._form.controls.newPassword.setValidators([Validators.required])
      else
        this._form.controls.newPassword.setValidators([Validators.required, ...validators])
    }, 500)
  }

  //- - - - - - - - - - - -//

  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);

  protected _form: FormGroup<ResetPwdForm> = this.fb.nonNullable.group({
    newPassword: ['Abc123!', [Validators.required, ...PasswordValidation.validationArray(6)]],
    confirmPassword: ['Abc123!', [Validators.required]]
  }, { validators: PasswordValidation.matchValidator('newPassword', 'confirmPassword') });

  private static _count = 0;
  protected _idSuffix = `-${SbResetPwdFormComponent._count++}`;

  //- - - - - - - - - - - -//

  protected submit() {
    if (!this._form.valid)
      return;

    const dto: ResetPwdFormDto = {
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
