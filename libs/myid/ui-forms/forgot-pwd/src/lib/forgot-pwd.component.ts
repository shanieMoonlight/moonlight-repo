import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

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

  showLabels = input<boolean>(true);
  forgotPassword = output<ForgotPasswordFormDto>()
  color = input<UiKitTheme>('primary');

  protected _form: FormGroup<ForgotPasswordForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

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
