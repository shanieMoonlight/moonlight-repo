import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ForgotPasswordFormDto } from '@spider-baby/myid-ui-forms/forgot-pwd';
import { ResetPwdFormDto, SbResetPwdFormComponent } from '@spider-baby/myid-ui-forms/reset-pwd';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { ForgotPwdModalButtonComponent } from '../../../main/ui/forgot-pwd-modal';
import { ResetPwdStateService } from './reset-pwd.state.service';

@Component({
  selector: 'sb-reset-pwd',
  imports: [
    SbResetPwdFormComponent,
    SbMatNotificationsModalComponent,
    ForgotPwdModalButtonComponent,
    SbButtonComponent
  ],
  providers: [
    ResetPwdStateService
  ],
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPwdComponent {

  private _state = inject(ResetPwdStateService)
  private _router = inject(MyIdRouter)



  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _readyToReset = this._state.readyToReset
  protected _resetSuccess = this._state.resetSuccess


  resetPwd = (data: ResetPwdFormDto) =>
    this._state.resetPwd(data);


  onForgotPwdClick = (dto: ForgotPasswordFormDto) =>
    this._state.forgotPassword(dto)


  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls