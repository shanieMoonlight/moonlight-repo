import { computed, inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UpdateSelfDto, UserManagementIoService } from '@spider-baby/myid-io';

@Injectable({
  providedIn: 'root'
})
export class UpdateSelfStateService {

  private _userMgmtIoService = inject(UserManagementIoService)
  private _accountIoService = inject(AccountIoService)

  //- - - - - - - - - - - - - //

  protected _updateState = MiniStateBuilder
    .CreateWithInput((dto: UpdateSelfDto) => this._userMgmtIoService.updateMember(dto))
    .setSuccessMsgFn((dto, response) => `${response.userName || response.email} updated successfully!`)


  protected _myInfoState = MiniStateBuilder
    .Create(() => this._accountIoService.myInfo())
    .trigger() //trigger immediately to load user data

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._updateState,
    this._myInfoState
  )

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  userData = this._myInfoState.data
  updateSuccess = computed(() => !!this._updateState.successMsg()?.length)


  //--------------------------//

  update = (dto: UpdateSelfDto) =>
    this._updateState.trigger(dto)

}//Cls

