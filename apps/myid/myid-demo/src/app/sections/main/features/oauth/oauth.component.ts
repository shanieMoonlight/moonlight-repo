import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { environment } from '../../../../../environments/environment';
import { SocialAuthSetup } from '../../../../config/oauth.config';
import { AccountIoService } from '../../../../shared/io/identity/account.io.service';
import { GoogleSignUp } from '../../../../shared/io/models/google-sign-up';
import { LoginDto } from '../../../../shared/io/models/login';


//########################//

const googleSocialUser: GoogleSignUp = {
  idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkOGE2NzM5OWU3ODgyYWNhZTdkN2Y2OGIyMjgwMjU2YTc5NmE1ODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNTY5MzY0OTI2NzEtZm9rdmtyZmIwaGNhOWhnczc1YXYyZGFtczc2amUydGwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNTY5MzY0OTI2NzEtZm9rdmtyZmIwaGNhOWhnczc1YXYyZGFtczc2amUydGwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE0NjUwMzcyNzIwNjY3ODUyNzIiLCJlbWFpbCI6InNoYW5lYnJhbm5pY2tAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0OTY2Mzg4MywibmFtZSI6IlNoYW5lIEJyYW5uaWNrIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xESWtpak93TS1keVdEVmxyemdzYVE2WjZQTGpNVFFCYVJJaGJ6akZUeUEyV2NraDQwPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlNoYW5lIiwiZmFtaWx5X25hbWUiOiJCcmFubmljayIsImlhdCI6MTc0OTY2NDE4MywiZXhwIjoxNzQ5NjY3NzgzLCJqdGkiOiIwNTQxNGJlODJlN2Q5NjFkNjA3ZDhjYzgyNTJkMWY0NzM3MDc0MGQ1In0.l5aKWEJyFClB5tS_q_k8jwyHgiWWPdzchSXjSPydUuYhCLVfWhau0nt-w2vLnKoVjtuHeHMJNbCXNzBk3EeKl3qeVwgJyoEDmEZ16oIQ1uoq5oFwIO623D3z7W99sne_2pbwIS0V2ATuKM8L1S0jzLV4ngGMeNcKf47MlKpg6Mf4sUO73CaheFyCxi75j-m-EmdddAAoNEQuU6dEHBW6m0-fKjlrPWz5L2JNo2IwlZdX5s0bJJWIQBKwN_hS9f37ItWQu0S9QqFOd0v0gq_YIsehtCamHD9n6bzYHfkp47OYieQ47o6OjjYwufVhul1UyYvwlTK45ip1iuUl5o_ELA",
  // email: "shanebrannick@gmail.com",
  // firstName: "Shane",
  // id: "111465037272066785272",
  // lastName: "Brannick",
  // name: "Shane Brannick",
  // photoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLDIkijOwM-dyWDVlrzgsaQ6Z6PLjMTQBaRIhbzjFTyA2Wckh40=s96-c",
  // provider: "GOOGLE",
  // response: null
}

//########################//



@Component({
  selector: 'sb-oauth',
  imports: [
    GoogleSigninButtonModule,
    MatEverythingModule,
    SbMatNotificationsModalComponent
  ],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OauthComponent implements OnInit {

  private _ioService = inject(AccountIoService)
  private _socialAuth = inject(SocialAuthService)

  //- - - - - - - - - - - - - //

  protected _loginState = MiniStateBuilder
    .CreateWithInput((dto: LoginDto) => this._ioService.login(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto.email ?? dto.username ?? dto.userId}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', jwtPackage); })


  protected _googleLoginState = MiniStateBuilder
    .CreateWithInput((dto: GoogleSignUp) => this._ioService.googleLogin(dto))
    .setSuccessMsgFn((dto) => `User,  ${dto}, is logged in successfully!`)
    .setOnSuccessFn((dto, jwtPackage) => { console.log('Login successful:', dto, jwtPackage); })

  //- - - - - - - - - - - - - //

  private _states = MiniStateCombined.Combine(
    this._loginState,
    this._googleLoginState)

  protected _successMsg = this._states.successMsg
  protected _errorMsg = this._states.errorMsg
  protected _loading = this._states.loading



  //--------------------------//

  constructor() {
    // Initialization logic can go here if needed
    console.log('OauthComponent initialized');
    console.log(environment.oauth);
    console.log(SocialAuthSetup.provideSocialLoginConfig());


  }

  //- - - - - - - - - - - - - //

  ngOnInit() {
    console.log('OauthComponent ngOnInit called');
    
    this._socialAuth.authState.subscribe((socialUser) => {
      console.log('Google Auth State:', socialUser);
      this._googleLoginState.trigger(socialUser)

    });
  }

  //--------------------------//


  loginStandard() {
    console.log('Login Standard');

    this._loginState.trigger({
      username: 'superLeader',
      password: 'Abc123!'
    })
  }


  googleLoginTest() {
    console.log('Login Standard');

    this._googleLoginState.trigger(googleSocialUser)

  }

}//Cls
