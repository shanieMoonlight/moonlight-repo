import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ResetPwdFormDto } from '../../../../shared/id/ui/forms/reset-pwd/reset-pwd.component';
import { ConfirmEmailWithPwdDto, ResetPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';
import { ConfirmEmailWithPwdFormComponent, ConfirmEmailWithPwdFormDto } from '../../../../shared/id/ui/forms/confirm-email-with-pwd/confirm-email-with-pwd.component';

@Component({
  selector: 'sb-confirm-email-with-pwd',
  imports: [
    SbMatNotificationsModalComponent,
    ConfirmEmailWithPwdFormComponent
  ],
  templateUrl: './confirm-email-with-pwd.component.html',
  styleUrl: './confirm-email-with-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailWithPwdComponent {



  private _ioService = inject(AccountIoService)
  
  //- - - - - - - - - - - - - //


  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: ConfirmEmailWithPwdDto) => this._ioService.confirmEmailWithPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._resetPwdState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  //--------------------------//


  confirmEmail = (dto: ConfirmEmailWithPwdFormDto) => {
    console.log('ConfirmEmailWithPwdFormDto', dto)
  }

}//Cls
