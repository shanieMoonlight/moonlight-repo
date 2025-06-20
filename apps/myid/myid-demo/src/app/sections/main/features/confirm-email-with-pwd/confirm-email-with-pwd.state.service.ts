import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { ConfirmEmailWithPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';

@Injectable()
export class ConfirmEmailWithPwdStateService {


  private _ioService = inject(AccountIoService)


  //- - - - - - - - - - - - - //


  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: ConfirmEmailWithPwdDto) => this._ioService.confirmEmailWithPassword(dto))
    .setSuccessMsgFn((dto, response) => `${response.message}`)


  //- - - - - - - - - - - - - //


  private _states = MiniStateCombined.Combine(
    this._resetPwdState)

  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading


  //--------------------------//


  confirmEmail = (dto: ConfirmEmailWithPwdDto) => {
    console.log('ConfirmEmailWithPwdFormDto', dto)
  }

}//Cls
