import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '../../../../shared/ui/buttons';
import { ConfirmEmailStateService } from './confirm-email.state.service';
import { EmailConfirmedCardComponent } from '../../ui/email-confirmed-card.component';

@Component({
  selector: 'sb-confirm-email',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    EmailConfirmedCardComponent,
    SbButtonComponent
  ],
  providers: [
    ConfirmEmailStateService
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

  protected _resendSuccessMsg = this._state.resendSuccessMsg
  protected _emailConfirmedSuccessMsg = this._state.emailConfirmedSucessMsg

  resendConfirmation = () =>
    this._state.resendConfirmation();

  goToLogin = () =>
    this._router.navigateToLogin();

}//Cls
