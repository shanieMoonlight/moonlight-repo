import { ChangeDetectionStrategy, Component, output, signal, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstErrorDirective } from '../../../utils/forms/first-error.directive';
import { SbButtonComponent } from '../../../ui/button/button.component';
import { SbCheckboxComponent } from '../../../ui/checkbox/checkbox.component';

//##########################//

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean
}

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe?: FormControl<boolean>
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
  form: FormGroup<LoginForm>;

  login = output<LoginDto>();
  showRemeberMe = input<boolean>(false);


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group<LoginForm>({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),
      rememberMe: this.fb.nonNullable.control(false, []),
    })
  }

  submit() {
    if (!this.form.valid)
      return

    const { email, password, rememberMe } = this.form.value;
    if (email && password) {
      const dto: LoginDto = { email, password, rememberMe };
      this.login.emit(dto);
    }

  }

}