import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ChangePwdFormComponent } from '../../../../shared/id/ui/forms/change-pwd/change-pwd.component';
import { ChPwdDto } from '../../../../shared/io/models';
import { AccountIoService } from '../../../../shared/io/services';
import { ChangePwdStateService } from './change-pwd.state.service';

@Component({
  selector: 'sb-change-pwd',
  imports: [
    SbMatNotificationsModalComponent,
    ChangePwdFormComponent
  ],
  providers: [ChangePwdStateService],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePwdComponent {

  private _state = inject(ChangePwdStateService)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading


  //--------------------------//


  changePassword = (dto: ChPwdDto) =>
    this._state.changePassword(dto);

}//Cls

