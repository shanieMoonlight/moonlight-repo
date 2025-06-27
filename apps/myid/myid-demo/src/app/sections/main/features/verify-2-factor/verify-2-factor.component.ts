import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbVerify2FactorFormComponent, Verify2FactorTknFormDto } from '../../../../shared/id/ui/forms/verify-2factor/verify-2factor.component';
import { Verify2FactorStateService } from './verify-2-factor.state.service';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';


@Component({
  selector: 'sb-verify-2-factor',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbVerify2FactorFormComponent,
    SbButtonComponent
  ],
  providers: [Verify2FactorStateService],
  templateUrl: './verify-2-factor.component.html',
  styleUrl: './verify-2-factor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify2FactorComponent {
  
  private _state = inject(Verify2FactorStateService)
  private _router = inject(AMyIdRouter)

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _resendCooldownCountdown= this._state.resendCooldownCountdown


  //--------------------------//

  constructor() {
   effect(() => {
      if (this._state.verifySuccess()) {
        const redirectUrl = this._state.redirectUrl();
        if (redirectUrl)
          this._router.navigate([redirectUrl])
        else
          this._router.navigateToHome()
      }
    })
  }


  verify2Factor = (dto: Verify2FactorTknFormDto) =>
    this._state.verify2Factor(dto.token);


  resend2Factor() {
    return this._state.resend2Factor();
  }


}//Cls

