import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../../ui/button/button.component';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { FirstErrorDirective } from '../../../../utils/forms/first-error.directive';

//##########################//

export interface ForgotPasswordFormDto {
  email: string;
}

interface ForgotPasswordForm {
  email: FormControl<string>;
}

//##########################//

@Component({
  selector: 'sb-forgot-pwd-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    SbButtonComponent,
    SbInputStyleDirective,
  ],
  templateUrl: './forgot-pwd.component.html',
  styleUrl: './forgot-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbForgotPwdFormComponent {

  private fb = inject(FormBuilder);

  showLables = input<boolean>(true);
  forgotPassword = output<ForgotPasswordFormDto>()

  protected form: FormGroup<ForgotPasswordForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  private static _count = 20;
  protected _idSuffix = `-${SbForgotPwdFormComponent._count++}`;

  //- - - - - - - - - - - -//

  protected submit() {
    if (!this.form.valid)
      return;

    const dto: ForgotPasswordFormDto = {
      email: this.form.controls.email.value,
    };

    this.forgotPassword.emit(dto);
  }

}//Cls
