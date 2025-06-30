import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { RegisterCustomerStateService } from './register.state.service'
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbRegisterCustomerFormComponent } from '../../../../shared/id/ui/forms/reg-customer/reg-customer-form.component';
import { RegisterCustomerDto } from '@spider-baby/myid-io/models';
import { ConfirmedCardComponent } from '../../ui/confirmed-card/confirmed-card.component';

@Component({
  selector: 'sb-register',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbRegisterCustomerFormComponent,
    SbButtonComponent,
    CommonModule,
    ConfirmedCardComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [RegisterCustomerStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCustomerComponent {

  private _state = inject(RegisterCustomerStateService)
  private _router = inject(AMyIdRouter)
  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  

  //--------------------------//


  register = (dto: RegisterCustomerDto) =>
    this._state.register(dto);
 
  goToLogin = () =>
    this._router.navigateToLogin();


}//Cls


