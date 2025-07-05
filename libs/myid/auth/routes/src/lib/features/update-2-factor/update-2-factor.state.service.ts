import { computed, inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { TwoFactorProvider, UpdateTwoFactorProviderDto } from '@spider-baby/myid-io/models';

@Injectable({
  providedIn: 'root'
})
export class Update2FactorStateService {

  private _ioService = inject(UserManagementIoService)
  private _accountIoService = inject(AccountIoService)

  //- - - - - - - - - - - - - //


  protected _updatePwdState = MiniStateBuilder
    .CreateWithInput((dto: UpdateTwoFactorProviderDto) => this._ioService.updateTwoFactorProvider(dto))
    .setSuccessMsgFn((dto, updatedUser) => `Provider for ${updatedUser.userName} updated to ${updatedUser.twoFactorProvider}`)


  protected _myInfoState = MiniStateBuilder
    .Create(() => this._accountIoService.myInfo())
    .trigger() //trigger immediately to load user data

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._updatePwdState,
    this._myInfoState
  )

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  updateSuccess = computed(() => !!this._updatePwdState.successMsg()?.length)
  private _userData = this._myInfoState.data
  currentProvider = computed(() => this._userData()?.twoFactorProvider || 'Email'); // Default to Email if not set


  //--------------------------//


  changePassword = (provider: TwoFactorProvider) =>
    this._updatePwdState.trigger({ provider })

}//Cls

