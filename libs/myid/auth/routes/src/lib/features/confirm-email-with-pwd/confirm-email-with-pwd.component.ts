import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ConfirmEmailWithPwdFormComponent, ConfirmEmailWithPwdFormDto } from '@spider-baby/myid-ui/confirm-email-with-pwd'
import { ConfirmEmailWithPwdStateService } from './confirm-email-with-pwd.state.service';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { ConfirmedCardComponent } from '../../ui/confirmed-card/confirmed-card.component';

@Component({
  selector: 'sb-confirm-email-with-pwd',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    ConfirmEmailWithPwdFormComponent,
    ConfirmedCardComponent,
    SbButtonComponent
  ],
  providers: [ConfirmEmailWithPwdStateService],
  templateUrl: './confirm-email-with-pwd.component.html',
  styleUrl: './confirm-email-with-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailWithPwdComponent {


  private _state = inject(ConfirmEmailWithPwdStateService)
  private _router = inject(MyIdRouter)

  //- - - - - - - - - - - - - //

  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _resendSuccess = this._state.resendSuccess

  protected _emailConfirmedSuccessMsg = this._state.emailConfirmedSuccessMsg
  protected _resendSuccessMsg = this._state.resendSuccessMsg


  //--------------------------//


  confirmEmail = (dto: ConfirmEmailWithPwdFormDto) =>
    this._state.confirmEmail(dto);

  resendConfirmation = () =>
    this._state.resendConfirmation();

  goToLogin = () =>
    this._router.navigateToLogin();

}//Cls
