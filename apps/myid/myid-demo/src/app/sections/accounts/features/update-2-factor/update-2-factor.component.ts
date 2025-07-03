import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UpdateTwoFactorProviderFormDto, SbUpdateTwoFactorProviderFormComponent } from '@spider-baby/myid-ui-forms/update-two-factor-provider';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { Update2FactorStateService } from './update-2-factor.state.service';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MyIdTwoFactorOptionsProvider } from '../../../../shared/id/utils/options/mfa/two-factor-options-provider';

@Component({
  selector: 'sb-update-2-factor',
  standalone: true,
  imports: [
    SbUpdateTwoFactorProviderFormComponent,
    SbMatNotificationsModalComponent,
    SbButtonComponent
  ],
  templateUrl: './update-2-factor.component.html',
  styleUrl: './update-2-factor.component.scss',
  providers: [Update2FactorStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Update2FactorComponent {

  private _state = inject(Update2FactorStateService)
  private _router = inject(MyIdRouter)
  private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _changeSuccess = this._state.updateSuccess
  protected _twoFactorProviderOptions = this._twoFactorOptionsProvider.getOptions();


  //--------------------------//


  updateProvider = (dto: UpdateTwoFactorProviderFormDto) =>
    this._state.changePassword(dto.provider);
 

  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls


