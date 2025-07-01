import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService } from '@spider-baby/myid-io';
import { GoogleSignInDto, RegisterCustomerDto } from '@spider-baby/myid-io/models';

@Injectable({
  providedIn: 'root'
})
export class RegisterCustomerStateService {

  private _accountIoService = inject(AccountIoService)

  //- - - - - - - - - - - - - //

  protected _registerState = MiniStateBuilder
    .CreateWithInput((dto: RegisterCustomerDto) => this._accountIoService.registerCustomer(dto))
    .setSuccessMsgFn((dto, response) => `${dto.username || dto.email} registered successfully!`)

  private _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: GoogleSignInDto) => this._accountIoService.googleLogin(dto))
    .setSuccessMsgFn((dto, response) => `Registration Complete!`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._registerState,
    this._googleLoginState
  )

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading

  //--------------------------//

  register = (dto: RegisterCustomerDto) =>
    this._registerState.trigger(dto)

  
  registerGoogle = (dto: GoogleSignInDto) =>
    this._googleLoginState.trigger(dto)


}//Cls

