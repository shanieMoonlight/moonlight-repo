import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { RegisterCustomerDto } from '@spider-baby/myid-io/models';

@Injectable({
  providedIn: 'root'
})
export class RegisterCustomerStateService {

  private _userMgmtIoService = inject(UserManagementIoService)
  private _accountIoService = inject(AccountIoService)

  //- - - - - - - - - - - - - //

  protected _registerState = MiniStateBuilder
    .CreateWithInput((dto: RegisterCustomerDto) => this._accountIoService.registerCustomer(dto))
    .setSuccessMsgFn((dto, response) => `${dto.username || dto.email} registered successfully!`)


  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._registerState
  )

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  //--------------------------//

  register = (dto: RegisterCustomerDto) =>
    this._registerState.trigger(dto)

}//Cls

