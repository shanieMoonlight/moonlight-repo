import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ChangePwdFormComponent } from '../../../../shared/id/ui/forms/change-pwd/change-pwd.component';
import { ChPwdDto } from '../../../../shared/id/io/models';
import { ChangePwdStateService } from './change-pwd.state.service';
import { SbButtonComponent } from '../../../../shared/ui/buttons';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';

@Component({
  selector: 'sb-change-pwd',
  imports: [
    SbMatNotificationsModalComponent,
    ChangePwdFormComponent,
    SbButtonComponent
  ],
  providers: [ChangePwdStateService],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePwdComponent {

  private _state = inject(ChangePwdStateService)
  private _router = inject(AMyIdRouter)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _changeSuccess = this._state.changeSuccess


  //--------------------------//


  changePassword = (dto: ChPwdDto) =>
    this._state.changePassword(dto);
 

  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls

