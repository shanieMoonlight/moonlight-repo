import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbCheckboxComponent } from '../../../ui/checkbox/checkbox.component';
import { SbInputStyleDirective } from '../../../ui/input/input.directive';
import { SbTextButtonComponent } from '../../../ui/text-button/text-button.component';
import { SbToggleIconButtonComponent } from '../../../ui/toggle-icon-button/toggle-icon-button.component';
import { FirstErrorDirective } from '../../../utils/forms/first-error.directive';

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
    SbToggleIconButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {

  private fb = inject(FormBuilder)

  showRemeberMe = input<boolean>(false);
  showForgotPwd = input<boolean>(true);
  socialTemplate = input<TemplateRef<any> | undefined>(undefined)


  login = output<LoginDto>();
  forgotPwd = output();

  protected showPassword = signal(false);

  protected form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['a@b.c', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false, []]
  });

  private static _count = 0;
  protected _idSuffix = `-${LoginFormComponent._count++}`;

  submit() {
    if (!this.form.valid)
      return

    const dto: LoginDto = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      rememberMe: this.form.controls.rememberMe.value,
    }

    this.login.emit(dto)
  }


  forgotPwdClick = () => this.forgotPwd.emit();



  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  onPasswordToggle(hide: boolean) {
    this.showPassword.set(!hide);
  }

}