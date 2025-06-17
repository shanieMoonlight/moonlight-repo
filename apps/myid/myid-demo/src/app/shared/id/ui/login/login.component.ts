import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbCheckboxComponent } from '../../../ui/checkbox/checkbox.component';
import { FirstErrorDirective } from '../../../utils/forms/first-error.directive';
import { SbInputStyleDirective } from '../../../ui/input/input.directive';
import { SbSelectComponent } from '../../../ui/select/select.component';

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
    SbSelectComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {

  private fb = inject(FormBuilder)

  login = output<LoginDto>();
  forgotPwd = output();
  showRemeberMe = input<boolean>(false);
  showForgotPwd = input<boolean>(false);


  protected form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['a@b.c', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false, []]
  });

  selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true }
  ];

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
  

}