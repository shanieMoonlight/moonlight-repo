import { computed, inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { ChPwdDto } from '@spider-baby/myid-io/models';
import { AccountIoService } from '@spider-baby/myid-io';

@Injectable()
export class ChangePwdStateService {

  private _ioService = inject(AccountIoService)

  //- - - - - - - - - - - - - //


  protected _changePwdState = MiniStateBuilder
    .CreateWithInput((dto: ChPwdDto) => this._ioService.changePassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message || `Password changed successfully!`}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._changePwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  changeSuccess = computed(() => !!this._changePwdState.successMsg()?.length)


  //--------------------------//


  changePassword = (dto: ChPwdDto) =>
    this._changePwdState.trigger(dto)

}//Cls

