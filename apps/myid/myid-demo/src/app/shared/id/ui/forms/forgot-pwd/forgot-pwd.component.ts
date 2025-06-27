import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';

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
    FirstErrorComponent,
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

  protected _form: FormGroup<ForgotPasswordForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  private static _count = 20;
  protected _idSuffix = `-${SbForgotPwdFormComponent._count++}`;

  //- - - - - - - - - - - -//

  protected submit() {
    if (!this._form.valid)
      return;

    const dto: ForgotPasswordFormDto = {
      email: this._form.controls.email.value,
    };

    this.forgotPassword.emit(dto);
  }

}//Cls
