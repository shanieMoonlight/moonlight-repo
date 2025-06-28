import { computed, inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { TwoFactorProvider, UpdateTwoFactorProviderDto, UserManagementIoService } from '@spider-baby/myid-io';

@Injectable({
  providedIn: 'root'
})
export class Update2FactorStateService {

  private _ioService = inject(UserManagementIoService)

  //- - - - - - - - - - - - - //


  protected _updatePwdState = MiniStateBuilder
    .CreateWithInput((dto: UpdateTwoFactorProviderDto) => this._ioService.updateTwoFactorProvider(dto))
    .setSuccessMsgFn((dto, updatedUser) => `Provider for ${updatedUser.userName} updated to ${updatedUser.twoFactorProvider}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._updatePwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  updateSuccess = computed(() => !!this._updatePwdState.successMsg()?.length)


  //--------------------------//


  changePassword = (provider: TwoFactorProvider) =>
    this._updatePwdState.trigger({ provider })

}//Cls

