import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { ConfirmPhoneDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Injectable()
export class ConfirmEmailStateService {

  private _ioService = inject(AccountIoService)

  //- - - - - - - - - - - - - //


  protected _confirmPwdState = MiniStateBuilder
    .CreateWithInput((dto: ConfirmPhoneDto) => this._ioService.confirmPhone(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._confirmPwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading


  //--------------------------//


  resend = (email: string) => {
    console.log('ConfirmEmailStateService', email)
  }

}//Cls
