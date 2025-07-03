import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { UpdateSelfStateService } from './update-self.state.service';
import { UpdateSelfFormDto, SbUpdateSelfFormComponent } from '@spider-baby/myid-ui-forms/update-self';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { MyIdTwoFactorOptionsProvider } from '../../../../shared/id/utils/options/mfa/two-factor-options-provider';

@Component({
  selector: 'sb-update-self',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbUpdateSelfFormComponent,
    SbButtonComponent,
    CommonModule
  ],
  templateUrl: './update-self.component.html',
  styleUrl: './update-self.component.scss',
  providers: [UpdateSelfStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateSelfComponent {

  private _state = inject(UpdateSelfStateService)
  private _router = inject(MyIdRouter)
  private _platformId = inject(PLATFORM_ID)
  private _twoFactorOptionsProvider = inject(MyIdTwoFactorOptionsProvider)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _updateSuccess = this._state.updateSuccess
  protected _userData = this._state.userData
  protected _showErrors = computed(() =>  !this._loading() && isPlatformBrowser(this._platformId) )

  protected _twoFactorProviderOptions = this._twoFactorOptionsProvider.getOptions();

  //--------------------------//


  updateSelf = (dto: UpdateSelfFormDto) =>
    this._state.update(dto);
 
  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls


