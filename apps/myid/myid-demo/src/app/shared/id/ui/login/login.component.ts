import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbCheckboxComponent } from '../../../ui/checkbox/checkbox.component';
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
  imports: [ReactiveFormsModule, FirstErrorDirective, SbButtonComponent, SbCheckboxComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {

  private fb = inject(FormBuilder)

  login = output<LoginDto>();
  showRemeberMe = input<boolean>(false);


  protected form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['a@b.c', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false, []]
  });

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

}