import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MiniStateBuilder, MiniStateCombined } from '@spider-baby/mini-state';
import { AccountIoService } from '@spider-baby/myid-io';
import { GoogleSignInDto, RegisterCustomerDto } from '@spider-baby/myid-io/models';
import { map } from 'rxjs';


//######################//

export type RegisterCustomerRouteDataOptions = {
  showSocialLinks?: boolean
}

export class RegisterCustomerRouteData {

  private constructor(
    public showSocialLinks: boolean
  ) { }

  static create = (options?: RegisterCustomerRouteDataOptions) =>
    new RegisterCustomerRouteData(options?.showSocialLinks ?? false);
}

//######################//

@Injectable({
  providedIn: 'root'
})
export class RegisterCustomerStateService {

  private _accountIoService = inject(AccountIoService)
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - - - - - //

  private _showSocialLinks$ = this._actRoute.data.pipe(
    map((data) => data as RegisterCustomerRouteData),
    map((data) => data.showSocialLinks ?? false),
  )
  showSocialLinks = toSignal(this._showSocialLinks$, { initialValue: false });

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

