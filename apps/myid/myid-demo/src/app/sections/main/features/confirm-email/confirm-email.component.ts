import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { ConfirmEmailStateService } from './confirm-email.state.service';

@Component({
  selector: 'sb-confirm-email',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
  ],
  providers: [ConfirmEmailStateService],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {


  private _state = inject(ConfirmEmailStateService)
  
  //- - - - - - - - - - - - - //


  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading


  
}//Cls
