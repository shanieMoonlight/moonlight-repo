import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ForgotPasswordFormDto, SbForgotPwdFormComponent } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';
import { SbButtonIconCloseComponent } from '../../../../shared/ui/buttons/button-close/button-close.component';

@Component({
  selector: 'sb-forgot-pwd-modal',
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


  email = output<ForgotPasswordFormDto>()

  //--------------------------//

  protected dismissModal = () =>
    this.openModal.update(() => false)


  protected onForgotPassword(dto: ForgotPasswordFormDto) {
    this.openModal.update(() => false);
    this.email.emit(dto);
  }

}

