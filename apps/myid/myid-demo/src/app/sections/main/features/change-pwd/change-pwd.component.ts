import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ChangePwdFormComponent } from '../../../../shared/id/ui/forms/change-pwd/change-pwd.component';
import { ChPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Component({
  selector: 'sb-change-pwd',
  imports: [
    SbMatNotificationsModalComponent,
    ChangePwdFormComponent
  ],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePwdComponent {

  private _ioService = inject(AccountIoService)
  
  //- - - - - - - - - - - - - //


  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: ChPwdDto) => this._ioService.changePassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._resetPwdState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  //--------------------------//


  changePassword = (dto: ChPwdDto) => {
    console.log('ConfirmEmailWithPwdFormDto', dto)
  }

}//Cls

