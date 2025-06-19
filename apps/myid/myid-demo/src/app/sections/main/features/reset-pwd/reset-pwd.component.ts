import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ResetPwdFormDto, SbResetPwdFormComponent } from '../../../../shared/id/ui/forms/reset-pwd/reset-pwd.component';
import { ResetPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Component({
  selector: 'sb-reset-pwd',
  imports: [
    SbResetPwdFormComponent,
    SbMatNotificationsModalComponent,
  ],
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPwdComponent {

  private _ioService = inject(AccountIoService)

  //- - - - - - - - - - - - - //


  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: ResetPwdDto) => this._ioService.resetPassword(dto))
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