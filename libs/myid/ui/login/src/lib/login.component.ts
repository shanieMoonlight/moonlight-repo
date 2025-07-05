import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FirstErrorComponent,
  FirstErrorDirective,
} from '@spider-baby/utils-forms';
import {
  SbButtonComponent,
  SbTextButtonComponent,
  SbToggleIconButtonComponent,
} from '@spider-baby/ui-kit/buttons';
import { SbCheckboxComponent } from '@spider-baby/ui-kit/checkboxes';
import { SbInputWithBtnDirective } from '@spider-baby/ui-kit/inputs';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

//##########################//

export interface LoginFormDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

//##########################//

@Component({
  selector: 'sb-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbCheckboxComponent,
    SbInputStyleDirective,
    SbTextButtonComponent,
    NgTemplateOutlet,
    SbToggleIconButtonComponent,
    SbInputWithBtnDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  showRemeberMe = input<boolean>(false);
  showForgotPwd = input<boolean>(true);
  socialTemplate = input<TemplateRef<unknown> | undefined>(undefined);
  showLabels = input<boolean>(true);
  color = input<UiKitTheme>('primary');

  login = output<LoginFormDto>();
  forgotPwd = output();

  protected showPassword = signal(false);

  protected _form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    rememberMe: [false, []],
  });

  //- - - - - - - - - - - -//

  submit() {
    if (!this._form.valid) return;

    const dto: LoginFormDto = {
      email: this._form.controls.email.value,
      password: this._form.controls.password.value,
      rememberMe: this._form.controls.rememberMe.value,
    };

    this.login.emit(dto);
  }

  protected forgotPwdClick = () => this.forgotPwd.emit();

  protected onPasswordToggle = (hide: boolean) => this.showPassword.set(!hide);
}
