import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ChPwdDto } from '@spider-baby/myid-io/models';
import { ChangePwdStateService } from './change-pwd.state.service';
import { ChangePwdFormComponent } from '@spider-baby/myid-ui/change-pwd';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { MyIdRouter } from '@spider-baby/myid-auth/config';

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
  private _router = inject(MyIdRouter)

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

