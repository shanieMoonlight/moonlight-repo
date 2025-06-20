import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbVerify2FactorFormComponent, Verify2FactorTknFormDto } from '../../../../shared/id/ui/forms/verify-2factor/verify-2factor.component';
import { Verify2FactorStateService } from './verify-2-factor.state.service';


@Component({
  selector: 'sb-verify-2-factor',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbVerify2FactorFormComponent
  ],
  providers: [Verify2FactorStateService],
  templateUrl: './verify-2-factor.component.html',
  styleUrl: './verify-2-factor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify2FactorComponent {

  private _state = inject(Verify2FactorStateService)

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading


  //--------------------------//


  verify2Factor = (dto: Verify2FactorTknFormDto) => {
    console.log('verify2Factor', dto);    
    this._state.verify2Factor(dto.token);
  }

}//Cls

