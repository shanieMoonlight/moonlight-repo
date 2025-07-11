import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbUpdateTwoFactorProviderFormComponent, UpdateTwoFactorProviderFormDto } from '@spider-baby/myid-ui/update-two-factor-provider';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MyIdTwoFactorOptionsProvider } from '@spider-baby/myid-auth/config';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { Update2FactorStateService } from './update-2-factor.state.service';

@Component({
  selector: 'sb-update-2-factor',
  standalone: true,
  imports: [
    SbUpdateTwoFactorProviderFormComponent,
    SbMatNotificationsModalComponent,
    SbButtonComponent,
    JsonPipe
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
  protected _currentProvider = this._state.currentProvider;  


  //--------------------------//


  updateProvider = (dto: UpdateTwoFactorProviderFormDto) =>
    this._state.changePassword(dto.provider);
 

  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls


