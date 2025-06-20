import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ConfirmEmailWithPwdFormComponent, ConfirmEmailWithPwdFormDto } from '../../../../shared/id/ui/forms/confirm-email-with-pwd/confirm-email-with-pwd.component';
import { ConfirmEmailWithPwdStateService } from './confirm-email-with-pwd.state.service';

@Component({
  selector: 'sb-confirm-email-with-pwd',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    ConfirmEmailWithPwdFormComponent
  ],
  providers: [ConfirmEmailWithPwdStateService],
  templateUrl: './confirm-email-with-pwd.component.html',
  styleUrl: './confirm-email-with-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailWithPwdComponent {


  private _state = inject(ConfirmEmailWithPwdStateService)
  
  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading


  //--------------------------//


  confirmEmail = (dto: ConfirmEmailWithPwdFormDto) => 
    this._state.confirmEmail(dto);

}//Cls
