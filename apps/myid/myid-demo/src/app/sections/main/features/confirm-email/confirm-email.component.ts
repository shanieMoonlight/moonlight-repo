import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { ConfirmEmailStateService } from './confirm-email.state.service';
import { ConfirmedCardComponent } from '../../ui/confirmed-card/confirmed-card.component';

@Component({
  selector: 'sb-confirm-email',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    ConfirmedCardComponent,
    SbButtonComponent
  ],
  providers: [
    ConfirmEmailStateService,
    ConfirmedCardComponent,
    SbButtonComponent
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {

  private _state = inject(ConfirmEmailStateService)
  private _router = inject(AMyIdRouter)

  //- - - - - - - - - - - - - //


  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _resendSuccess = this._state.resendSuccess
  protected _confirmationSuccess = this._state.confirmationSuccess

  protected _emailConfirmedSuccessMsg = this._state.emailConfirmedSuccessMsg
  protected _resendSuccessMsg = this._state.resendSuccessMsg

  resendConfirmation = () =>
    this._state.resendConfirmation();

  goToLogin = () =>
    this._router.navigateToLogin();

}//Cls
