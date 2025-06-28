import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UpdateSelfStateService } from './update-self.state.service';
import { UpdateSelfFormDto, SbUpdateSelfFormComponent } from '@spider-baby/myid-ui-forms/update-self';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { CommonModule } from '@angular/common';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';

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
  private _router = inject(AMyIdRouter)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _updateSuccess = this._state.updateSuccess
  protected _userData = this._state.userData


  //--------------------------//


  updateSelf = (dto: UpdateSelfFormDto) =>
    this._state.update(dto);
 
  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls


