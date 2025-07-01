import { GoogleSigninButtonDirective, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RegisterCustomerDto } from '@spider-baby/myid-io/models';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbRegisterCustomerFormComponent } from '../../../../shared/id/ui/forms/reg-customer/reg-customer-form.component';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { ConfirmedCardComponent } from '../../ui/confirmed-card/confirmed-card.component';
import { RegisterCustomerStateService } from './register.state.service';

@Component({
  selector: 'sb-register',
  standalone: true,
  imports: [
    SbMatNotificationsModalComponent,
    SbRegisterCustomerFormComponent,
    GoogleSigninButtonDirective,
    ConfirmedCardComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [RegisterCustomerStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCustomerComponent  implements OnInit{

  private _state = inject(RegisterCustomerStateService)
  private _router = inject(AMyIdRouter)
  private _socialAuth = inject(SocialAuthService)
  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - //

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading

  
  ngOnInit() {
    this._socialAuth.authState.subscribe((socialUser) => {
      this._state.registerGoogle(socialUser)
    })
  }
  

  //--------------------------//


 protected register = (dto: RegisterCustomerDto) =>
    this._state.register(dto);
 
 protected goToLogin = () =>
    this._router.navigateToLogin();


}//Cls


