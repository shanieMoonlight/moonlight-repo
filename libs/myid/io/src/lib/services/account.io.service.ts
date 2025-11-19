import { Injectable, inject } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import {
  AppUserDto,
  AppUserCustomerDto,
  AuthAppSetupDto,
  ChPwdDto,
  ConfirmEmailDto,
  ConfirmEmailWithPwdDto,
  ConfirmPhoneDto,
  CookieSignInDto,
  CookieSignInResultData,
  FacebookSignInDto,
  ForgotPwdDto,
  GoogleCookieSignInDto,
  GoogleSignInDto,
  JwtPackage,
  LoginDto,
  LoginRefreshDto,
  MessageResponseDto,
  RegisterCustomerDto,
  RegisterCustomer_NoPwdDto,
  Resend2FactorDto,
  ResendEmailConfirmationDto,
  ResendPhoneConfirmationDto,
  ResetPwdDto,
  TwoFactorAuthAppCompleteRegDto,
  Verify2FactorCookieDto,
  Verify2FactorDto,
  FaceBookCookieSignInDto as FacebookCookieSignInDto,
  AmazonSignInDto,
  AmazonCookieSignInDto
} from '@spider-baby/myid-io/models';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class AccountIoService extends AServerIoService {

  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.Account.Controller);
  }

  closeAccountByTeamId = (
    teamId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.Account.action('closeAccount'),
      [teamId],
      opts ?? {}
    );

  closeMyAccountByTeamId = (
    teamId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.Account.action('closeMyAccount'),
      [teamId],
      opts ?? {}
    );

  myInfoCustomer = (opts?: unknown): Observable<AppUserCustomerDto> =>
    this._getAction<AppUserCustomerDto>(
      ServerRoutes.Account.action('myInfoCustomer'),
      opts ?? {}
    );

  registerCustomer = (
    dto: RegisterCustomerDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('registerCustomer'),
      dto,
      opts ?? {}
    );

  createCustomer = (
    dto: RegisterCustomer_NoPwdDto,
    opts?: unknown
  ): Observable<AppUserCustomerDto> =>
    this._postAction<AppUserCustomerDto>(
      ServerRoutes.Account.action('createCustomer'),
      dto,
      opts ?? {}
    );

  googleLogin = (
    dto: GoogleSignInDto,
    opts?: unknown
  ): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('googleLogin'),
      dto,
      opts ?? {}
    );

  googleCookieSignin = (
    dto: GoogleCookieSignInDto,
    opts?: unknown
  ): Observable<CookieSignInResultData> =>
    this._postAction<CookieSignInResultData>(
      ServerRoutes.Account.action('googleCookieSignin'),
      dto,
      opts ?? {}
    );

  amazonLogin = (
    dto: AmazonSignInDto,
    opts?: unknown
  ): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('amazonLogin'),
      dto,
      opts ?? {}
    );

  amazonCookieSignin = (
    dto: AmazonCookieSignInDto,
    opts?: unknown
  ): Observable<CookieSignInResultData> =>
    this._postAction<CookieSignInResultData>(
      ServerRoutes.Account.action('amazonCookieSignin'),
      dto,
      opts ?? {}
    );


  faceBookLogin = (
    dto: FacebookSignInDto,
    opts?: unknown
  ): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('facebookLogin'),
      dto,
      opts ?? {}
    );

  faceBookCookieSignin = (
    dto: FacebookCookieSignInDto,
    opts?: unknown
  ): Observable<CookieSignInResultData> =>
    this._postAction<CookieSignInResultData>(
      ServerRoutes.Account.action('facebookCookieSignin'),
      dto,
      opts ?? {}
    );


  confirmPhone = (
    dto: ConfirmPhoneDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('confirmPhone'),
      dto,
      opts ?? {}
    );

  resendPhoneConfirmation = (
    dto: ResendPhoneConfirmationDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('resendPhoneConfirmation'),
      dto,
      opts ?? {}
    );

  resendPhoneConfirmationAuthorized = (
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._getAction<MessageResponseDto>(
      ServerRoutes.Account.action('resendPhoneConfirmationAuthorized'),
      opts ?? {}
    );

  resendPhoneConfirmationByEmail = (
    email: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._getActionById<MessageResponseDto>(
      ServerRoutes.Account.action('resendPhoneConfirmation'),
      [email],
      opts ?? {}
    );

  confirmEmail = (
    dto: ConfirmEmailDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('confirmEmail'),
      dto,
      opts ?? {}
    );

  confirmEmailWithPassword = (
    dto: ConfirmEmailWithPwdDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('confirmEmailWithPassword'),
      dto,
      opts ?? {}
    );

  forgotPassword = (
    dto: ForgotPwdDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('forgotPassword'),
      dto,
      opts ?? {}
    );

  login = (dto: LoginDto, opts?: unknown): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('login'),
      dto,
      opts ?? {}
    );

  loginRefresh = (
    dto: LoginRefreshDto,
    opts?: unknown
  ): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('loginRefresh'),
      dto,
      opts ?? {}
    );

  cookieSignOut = (opts?: unknown): Observable<any> =>
    this._postAction<any>(
      ServerRoutes.Account.action('cookieSignOut'),
      opts ?? {}
    );

  cookieSignIn = (
    dto: CookieSignInDto,
    opts?: unknown
  ): Observable<CookieSignInResultData> =>
    this._postAction<CookieSignInResultData>(
      ServerRoutes.Account.action('cookieSignIn'),
      dto,
      opts ?? {}
    );

  changePassword = (
    dto: ChPwdDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('changePassword'),
      dto,
      opts ?? {}
    );

  myInfo = (opts?: unknown): Observable<AppUserDto> =>
    this._getAction<AppUserDto>(
      ServerRoutes.Account.action('myInfo'),
      opts ?? {}
    );

  refreshTokenRevoke = (opts?: unknown): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('refreshTokenRevoke'),
      opts ?? {}
    );

  resendEmailConfirmation = (
    dto: ResendEmailConfirmationDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('resendEmailConfirmation'),
      dto,
      opts ?? {}
    );

  resendEmailConfirmationAuthorized = (
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._getAction<MessageResponseDto>(
      ServerRoutes.Account.action('resendEmailConfirmationAuthorized'),
      opts ?? {}
    );

  resendEmailConfirmationByEmail = (
    email: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._getActionById<MessageResponseDto>(
      ServerRoutes.Account.action('resendEmailConfirmation'),
      [email],
      opts ?? {}
    );

  twoFactorResend = (
    dto: Resend2FactorDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('resendTwoFactor'),
      dto,
      opts ?? {}
    );


  twoFactorResendCookie = (
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('resendTwoFactorCookie'),
      {},
      opts ?? {}
    );

  twoFactorVerification = (
    dto: Verify2FactorDto,
    opts?: unknown
  ): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('twoFactorVerification'),
      dto,
      opts ?? {}
    );

  twoFactorVerificationCookie = (
    dto: Verify2FactorCookieDto,
    opts?: unknown
  ): Observable<JwtPackage> =>
    this._postAction<JwtPackage>(
      ServerRoutes.Account.action('twoFactorVerificationCookie'),
      dto,
      opts ?? {}
    );

  twoFactorSetupData = (opts?: unknown): Observable<AuthAppSetupDto> =>
    this._getAction<AuthAppSetupDto>(
      ServerRoutes.Account.action('twoFactorSetupData'),
      opts ?? {}
    );

  twoFactorAuthAppEmailCompleteByCode = (
    code: string,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._postAction<AppUserDto>(
      ServerRoutes.Account.action('twoFactorAuthAppEmailComplete'),
      code,
      opts ?? {}
    );

  twoFactorAuthAppComplete = (
    dto: TwoFactorAuthAppCompleteRegDto,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._postAction<AppUserDto>(
      ServerRoutes.Account.action('twoFactorAuthAppComplete'),
      dto,
      opts ?? {}
    );

  enableTwoFactorAuthentication = (opts?: unknown): Observable<AppUserDto> =>
    this._patchAction<AppUserDto>(
      ServerRoutes.Account.action('enableTwoFactorAuthentication'),
      opts ?? {}
    );

  disableTwoFactorAuthentication = (opts?: unknown): Observable<AppUserDto> =>
    this._patchAction<AppUserDto>(
      ServerRoutes.Account.action('disableTwoFactorAuthentication'),
      opts ?? {}
    );

  resetPassword = (
    dto: ResetPwdDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Account.action('resetPassword'),
      dto,
      opts ?? {}
    );
}
