import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { Verify2FactorDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Injectable()
export class Verify2FactorStateService {

  private _ioService = inject(AccountIoService)
  
  //- - - - - - - - - - - - - //

  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: Verify2FactorDto) => this._ioService.twoFactorVerification(dto))
    .setSuccessMsgFn(() => `${'2FA verification successful!'}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._resetPwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading


  //--------------------------//


  verify2Factor = (code: string) => {
    console.log('verify2Factor', code)
  }

}//Cls

