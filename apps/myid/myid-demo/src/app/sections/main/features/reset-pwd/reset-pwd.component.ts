import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ResetPwdFormDto, SbResetPwdFormComponent } from '../../../../shared/id/ui/forms/reset-pwd/reset-pwd.component';
import { ResetPwdStateService } from './reset-pwd.state.service';

@Component({
  selector: 'sb-reset-pwd',
  imports: [
    SbResetPwdFormComponent,
    SbMatNotificationsModalComponent,
  ],
  providers:[ResetPwdStateService],
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPwdComponent {

  private _state = inject(ResetPwdStateService)

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _readyToReset = this._state.readyToReset

  resetPwd = (data: ResetPwdFormDto) => 
    this._state.resetPwd(data);
  

}//Cls