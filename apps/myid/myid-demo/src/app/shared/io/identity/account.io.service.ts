import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityServerRoutes } from '../../../config/io/id/id.server.routes';
import { AddCustomerMember } from '../models/add-customer-member';
import { AddMntcMember } from '../models/add-mntc-member';
import { AddSprMember } from '../models/add-spr-member';
import { AppUser } from '../models/app-user';
import { AuthAppSetup } from '../models/auth-app-setup';
import { ChPwd } from '../models/ch-pwd';
import { ConfirmEmail } from '../models/confirm-email';
import { ConfirmEmailWithPwd } from '../models/confirm-email-with-pwd';
import { ConfirmPhone } from '../models/confirm-phone';
import { CreateCustomer } from '../models/create-customer';
import { ForgotPwd } from '../models/forgot-pwd';
import { GoogleSignUp } from '../models/google-sign-up';
import { Identifier } from '../models/identifier';
import { JwtPackage } from '../models/jwt-package';
import { LoginDto } from '../models/login';
import { MessageResponse } from '../models/msg-response';
import { RegCustomer } from '../models/reg-customer';
import { RegMntcLeader } from '../models/reg-mntc-leader';
import { ResendEmailConfirmation } from '../models/resend-email-confirmation';
import { ResendPhoneConfirmation } from '../models/resend-phone-confirmation';
import { Resend2Factor } from '../models/resend2-factor';
import { ResetPwd } from '../models/reset-pwd';
import { TwoFactorAuthAppComplete } from '../models/two-factor-auth-app-complete';
import { Verify2Factor } from '../models/verify2-factor';
import { IdentityIoService } from './base/identity.io.service';

@Injectable({
  providedIn: 'root'
})
export class AccountIoService extends IdentityIoService {

  constructor() { 
    super(IdentityServerRoutes.Account.Controller);
  }

  //- - - - - - - - - - - - - -//

  googleLogin = (dto: GoogleSignUp, opts?: unknown): Observable<AppUser> =>
    this.postAction(
      IdentityServerRoutes.Account.action('googleLogin'),
      dto,
      opts ?? {}
    );

  //------------------//

  confirmEmail = (dto: ConfirmEmail, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('confirmEmail'),
      dto,
      opts ?? {}
    );

  //------------------//

  confirmEmailWithPassword = (dto: ConfirmEmailWithPwd, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('confirmEmailWithPassword'),
      dto,
      opts ?? {}
    );

  //------------------//

  confirmPhone = (dto: ConfirmPhone, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('confirmPhone'),
      dto,
      opts ?? {}
    );

  //------------------//

  forgotPassword = (dto: ForgotPwd, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('forgotPassword'),
      dto,
      opts ?? {}
    );

  //------------------//

  login = (dto: LoginDto, opts?: unknown): Observable<JwtPackage> =>
    this.postAction(IdentityServerRoutes.Account.action('login'), dto, opts ?? {});

  //------------------//

  changePassword = (dto: ChPwd, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('changePassword'),
      dto,
      opts ?? {}
    );

  //------------------//

  myInfo = (opts?: unknown): Observable<AppUser> =>
    this.getAction(IdentityServerRoutes.Account.action('myInfo'), opts ?? {});

  //------------------//

  myInfoCustomer = (opts?: unknown): Observable<AppUser> =>
    this.getAction(IdentityServerRoutes.Account.action('myInfoCustomer'), opts ?? {});

  //------------------//

  registerCustomer = (dto: RegCustomer, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('registerCustomer'),
      dto,
      opts ?? {}
    );

  //------------------//

  createCustomer = (dto: CreateCustomer, opts?: unknown): Observable<AppUser> =>
    this.postAction(
      IdentityServerRoutes.Account.action('createCustomer'),
      dto,
      opts ?? {}
    );

  //------------------//

  registerMntcTeamLeader = (dto: RegMntcLeader, opts?: unknown): Observable<AppUser> =>
    this.postAction(
      IdentityServerRoutes.Account.action('registerMntcTeamLeader'),
      dto,
      opts ?? {}
    );

  //------------------//

  addMntcTeamMember = (dto: AddMntcMember, opts?: unknown): Observable<AppUser> =>
    this.postAction(
      IdentityServerRoutes.Account.action('addMntcTeamMember'),
      dto,
      opts ?? {}
    );

  //------------------//

  addSprTeamMember = (dto: AddSprMember, opts?: unknown): Observable<AppUser> =>
    this.postAction(
      IdentityServerRoutes.Account.action('addSuperTeamMember'),
      dto,
      opts ?? {}
    );

  //------------------//

  addCustomerTeamMember = (dto: AddCustomerMember, opts?: unknown): Observable<AppUser> =>
    this.postAction(
      IdentityServerRoutes.Account.action('addCustomerTeamMember'),
      dto,
      opts ?? {}
    );

  //------------------//

  closeAccount = (
    teamId: Identifier,
    opts?: unknown
  ): Observable<MessageResponse> =>
    this.delete(
      `${IdentityServerRoutes.Account.action('closeAccount')}/${teamId}`,
      opts ?? {}
    );

  //------------------//

  resendEmailConfirmationNotLoggedIn = (dto: ResendEmailConfirmation, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('resendEmailConfirmation'),
      dto,
      opts ?? {}
    );

  //------------------//

  resendEmailConfirmation = (opts?: unknown): Observable<MessageResponse> =>
    this.getAction(
      IdentityServerRoutes.Account.action('resendEmailConfirmation'),
      opts ?? {}
    );

  //------------------//

  resendPhoneConfirmationNotLoggedIn = (dto: ResendPhoneConfirmation, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('resendPhoneConfirmation'),
      dto,
      opts ?? {}
    );

  //------------------//

  resendPhoneConfirmation = (opts?: unknown): Observable<MessageResponse> =>
    this.getAction(
      IdentityServerRoutes.Account.action('resendPhoneConfirmation'),
      opts ?? {}
    );

  //------------------//

  resendTwoFactor = (dto: Resend2Factor, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('twoFactorResend'),
      dto,
      opts ?? {}
    );

  //------------------//

  twoFactorVerification = (dto: Verify2Factor, opts?: unknown): Observable<JwtPackage> =>
    this.postAction(
      IdentityServerRoutes.Account.action('twoFactorVerification'),
      dto,
      opts ?? {}
    );

  //------------------//

  twoFactorSetupData = (opts?: unknown): Observable<AuthAppSetup> =>
    this.getAction(IdentityServerRoutes.Account.action('twoFactorSetupData'), opts ?? {});

  //------------------//

  twoFactorAuthAppEmailComplete = (code: Identifier, opts?: unknown): Observable<AppUser> =>
    this.getAction(
      `${IdentityServerRoutes.Account.action('twoFactorAuthAppEmailComplete')}/${code}`,
      opts ?? {}
    );

  //------------------//

  twoFactorAuthAppComplete = (dto: TwoFactorAuthAppComplete, opts?: unknown): Observable<AppUser> =>
    this.getAction(
      IdentityServerRoutes.Account.action('twoFactorAuthAppComplete'),
      opts ?? {}
    );

  //------------------//

  enableTwoFactorAuthentication = (opts?: unknown): Observable<AppUser> =>
    this.patchAction(
      IdentityServerRoutes.Account.action('enableTwoFactorAuthentication'),
      opts ?? {}
    );

  //------------------//

  disableTwoFactorAuthentication = (opts?: unknown): Observable<AppUser> =>
    this.patchAction(
      IdentityServerRoutes.Account.action('disableTwoFactorAuthentication'),
      opts ?? {}
    );

  //------------------//

  resetPassword = (dto: ResetPwd, opts?: unknown): Observable<MessageResponse> =>
    this.postAction(
      IdentityServerRoutes.Account.action('resetPassword'),
      dto,
      opts ?? {}
    );

  //------------------//

  testSe = (opts?: unknown): Observable<unknown> =>
    this.getAction(IdentityServerRoutes.Account.action('testSe'), opts ?? {});

  //------------------//

} //Cls
