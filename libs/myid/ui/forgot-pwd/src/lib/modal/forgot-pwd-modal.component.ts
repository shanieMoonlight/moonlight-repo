import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { SbButtonIconCloseComponent } from '@spider-baby/ui-kit/buttons';
import { ForgotPasswordFormDto, SbForgotPwdFormComponent } from '../forgot-pwd.component';

@Component({
  selector: 'sb-forgot-pwd-modal',
  standalone: true,
  imports: [
    SbForgotPwdFormComponent,
    SbButtonIconCloseComponent
  ],
  templateUrl: './forgot-pwd-modal.component.html',
  styleUrl: './forgot-pwd-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPwdModalComponent {

  openModal = model<boolean>(false)
  description = input<string>('Please enter your email address to receive a password reset link.');


  forgotPwd = output<ForgotPasswordFormDto>()

  //--------------------------//

  protected dismissModal = () =>
    this.openModal.update(() => false)


  protected onForgotPassword(dto: ForgotPasswordFormDto) {
    this.openModal.update(() => false);
    this.forgotPwd.emit(dto);
  }

}

