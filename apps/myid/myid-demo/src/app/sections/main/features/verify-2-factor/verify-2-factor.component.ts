import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbVerify2FactorFormComponent, Verify2FactorTknFormDto } from '../../../../shared/id/ui/forms/verify-2factor/verify-2factor.component';
import { Verify2FactorDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';


@Component({
  selector: 'sb-verify-2-factor',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbVerify2FactorFormComponent
  ],
  templateUrl: './verify-2-factor.component.html',
  styleUrl: './verify-2-factor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify2FactorComponent {

  private _ioService = inject(AccountIoService)

  //- - - - - - - - - - - - - //


  protected _resetPwdState = MiniStateBuilder
    .CreateWithInput((dto: Verify2FactorDto) => this._ioService.twoFactorVerification(dto))
    .setSuccessMsgFn(() => `${'2FA verification successful!'}`)

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._resetPwdState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  //--------------------------//


  verify2Factor = (dto: Verify2FactorTknFormDto) => {
    console.log('verify2Factor', dto)
  }

}//Cls

