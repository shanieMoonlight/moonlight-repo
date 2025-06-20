import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ConfirmPhoneFormDto, SbConfirmPhoneFormComponent } from '../../../../shared/id/ui/forms/confirm-phone/confirm-phone.component';
import { ConfirmPhoneStateService } from './confirm-phone.state.service';

@Component({
  selector: 'sb-confirm-phone',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbConfirmPhoneFormComponent
  ],
  providers: [ConfirmPhoneStateService],
  templateUrl: './confirm-phone.component.html',
  styleUrl: './confirm-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPhoneComponent {

  private _state = inject(ConfirmPhoneStateService)

  //- - - - - - - - - - - - - //


  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading


  //--------------------------//


  confirmPhone = (dto: ConfirmPhoneFormDto) =>
    this._state.confirmPhone(dto.confirmationToken);


}//Cls
