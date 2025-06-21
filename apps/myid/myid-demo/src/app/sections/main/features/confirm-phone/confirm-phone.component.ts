import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '../../../../shared/ui/buttons';
import { ConfirmedCardComponent } from '../../ui/confirmed-card/confirmed-card.component';
import { ConfirmPhoneStateService } from './confirm-phone.state.service';

@Component({
  selector: 'sb-confirm-phone',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    ConfirmedCardComponent,
    SbButtonComponent
  ],
  providers: [ConfirmPhoneStateService],
  templateUrl: './confirm-phone.component.html',
  styleUrl: './confirm-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPhoneComponent {

  private _state = inject(ConfirmPhoneStateService)
  private _router = inject(AMyIdRouter)

  //- - - - - - - - - - - - - //


  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _resendSuccess = this._state.resendSuccess
  protected _confirmationSuccess = this._state.confirmationSuccess

  protected _phoneConfirmedSuccessMsg = this._state.phoneConfirmedSuccessMsg
  protected _resendSuccessMsg = this._state.resendSuccessMsg


  //--------------------------//

  resendConfirmation = () =>
    this._state.resendConfirmation();

  goToLogin = () =>
    this._router.navigateToLogin();

}//Cls
