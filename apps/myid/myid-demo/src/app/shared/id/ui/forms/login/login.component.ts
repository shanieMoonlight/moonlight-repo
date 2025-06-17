import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../../ui/button/button.component';
import { SbCheckboxComponent } from '../../../../ui/checkbox/checkbox.component';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { SbTextButtonComponent } from '../../../../ui/text-button/text-button.component';
import { SbToggleIconButtonComponent } from '../../../../ui/toggle-icon-button/toggle-icon-button.component';
import { FirstErrorDirective } from '../../../../utils/forms/first-error.directive';
import { SbInputWithBtnDirective } from '../../../../ui/input/input-with-btn.directive';

//##########################//

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean
}

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>
}

//##########################//


@Component({
  selector: 'sb-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    SbButtonComponent,
    SbCheckboxComponent,
    SbInputStyleDirective,
    SbTextButtonComponent,
    NgTemplateOutlet,
    SbToggleIconButtonComponent,
    SbInputWithBtnDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {

  private fb = inject(FormBuilder)

  showRemeberMe = input<boolean>(false);
  showForgotPwd = input<boolean>(true);
  socialTemplate = input<TemplateRef<unknown> | undefined>(undefined)
  showLables = input<boolean>(true);



  login = output<LoginDto>();
  forgotPwd = output();

  protected showPassword = signal(false);

  protected _form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['a@b.c', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false, []]
  });

  private static _count = 0;
  protected _idSuffix = `-${LoginFormComponent._count++}`;

  //- - - - - - - - - - - -//

  submit() {
    if (!this._form.valid)
      return

    const dto: LoginDto = {
      email: this._form.controls.email.value,
      password: this._form.controls.password.value,
      rememberMe: this._form.controls.rememberMe.value,
    }

    this.login.emit(dto)
  }

  protected forgotPwdClick = () =>
    this.forgotPwd.emit()

  protected onPasswordToggle = (hide: boolean) =>
    this.showPassword.set(!hide);

}