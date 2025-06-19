import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ResetPwdFormDto } from '../../../../shared/id/ui/forms/reset-pwd/reset-pwd.component';
import { ConfirmPhoneDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Component({
  selector: 'sb-confirm-email',
  imports: [
    SbMatNotificationsModalComponent,
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {


  private _ioService = inject(AccountIoService)
  
  //- - - - - - - - - - - - - //


  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: ConfirmPhoneDto) => this._ioService.confirmPhone(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._resetPwdState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  //--------------------------//

  resetPwd = (dto: ResetPwdFormDto) => {
    console.log('ResetPwdComponent.resetPwd', dto)
  }
  
}//Cls
