import { GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, MaintenanceAuthenticatorDemoIoService } from '@spider-baby/myid-io';
import { LoginDto } from '@spider-baby/myid-io/models';
import { ConfirmEmailWithPwdFormDto } from '@spider-baby/myid-ui-forms/confirm-email-with-pwd';
import { UpdateTwoFactorProviderFormDto } from '@spider-baby/myid-ui-forms/update-two-factor-provider';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppUserDtoFormDto, SbAppUserFormComponent } from '../../../../shared/id/ui/forms/app-user/app-user.component';
import { SbTeamFormComponent } from '../../../../shared/id/ui/forms/team/team.component';
import { demoTeamData, demoTeamDataMinimal, demoTeamDataSuper } from './fake-team-data';
import { demoAppUserData, demoAppUserDataMinimal } from './fake-user-data';
import { googleSocialUser } from './secret';




@Component({
  selector: 'sb-oauth',
  imports: [
    GoogleSigninButtonModule,
    MatEverythingModule,
    SbButtonComponent,
    SbMatNotificationsModalComponent,
    SbTeamFormComponent,
    SbAppUserFormComponent
    
],
  standalone: true,
  templateUrl: './scratchpad.component.html',
  styleUrl: './scratchpad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScratchpadComponent {

  private _ioService = inject(AccountIoService)
  private _ioMntcAuthTest = inject(MaintenanceAuthenticatorDemoIoService)

  //- - - - - - - - - - - - - //

  _demoTeam  =demoTeamData

  protected _authFailTestState = MiniStateBuilder
    .Create(() => this._ioMntcAuthTest.mntc())
    .setSuccessMsgFn((dto, response) => `Message: ${response.message}\nAuthenticator: ${response.authenticator}`)
    .setOnSuccessFn((dto, response) => { console.log('Success:', response); })

  protected _loginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._ioService.login(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })

  protected _cookieLoginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._ioService.cookieSignIn(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })


  protected _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: SocialUser) => this._ioService.googleCookieSignin(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.firstName}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._loginState,
    this._cookieLoginState,
    this._authFailTestState,
    this._googleLoginState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading


  protected _testUser = demoAppUserData;
  protected _testUserMinimal = demoAppUserDataMinimal;
  protected _testTeam = demoTeamData;
  protected _testTeamSuper = demoTeamDataSuper;
  protected _testTeamMinimal = demoTeamDataMinimal;



  //--------------------------//


  loginJwt = (dto: LoginDto) =>
    this._loginState.trigger(dto)

  loginCookie = (dto: LoginDto) =>
    this._cookieLoginState.trigger(dto)



  googleLoginTest() {
    console.log('Login OAuth');
    this._googleLoginState.trigger(googleSocialUser)
  }


  handlePasswordSet(dto: ConfirmEmailWithPwdFormDto) {
    console.log('Password set event:', dto)
  }


  handleProviderUpdate(dto: UpdateTwoFactorProviderFormDto) {
    console.log('Updating 2FA provider to:', dto);
  }


  handleAddUser(dto: AppUserDtoFormDto) {
    console.log('Adding User:', dto.teamPosition, dto);
  }


  handleEditUser(dto: AppUserDtoFormDto) {
    console.log('Updating User:', dto.teamPosition, dto);
  }

  authFailTest() {
    console.log('authFailTest');
    this._authFailTestState.trigger()
  }


}//Cls
