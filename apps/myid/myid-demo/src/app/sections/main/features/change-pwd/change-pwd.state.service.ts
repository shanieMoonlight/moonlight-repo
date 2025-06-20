import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { ChPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Injectable()
export class ChangePwdStateService {

  private _ioService = inject(AccountIoService)

  //- - - - - - - - - - - - - //


  protected _changePwdState = MiniStateBuilder
    .CreateWithInput((dto: ChPwdDto) => this._ioService.changePassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._changePwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading


  //--------------------------//


  changePassword = (dto: ChPwdDto) =>
    this._changePwdState.trigger(dto)

}//Cls

