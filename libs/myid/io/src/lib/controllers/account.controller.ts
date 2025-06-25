const CONTROLLER = 'Account';

type ACTIONS =
  | 'closeAccount'
  | 'myInfoCustomer'
  | 'registerCustomer'
  | 'createCustomer'
  | 'addCustomerTeamMember'
  | 'addCustomerTeamMemberMntc'
  | 'googleLogin'
  | 'googleCookieSignin'
  | 'confirmPhone'
  | 'resendPhoneConfirmation'
  | 'resendPhoneConfirmationAuthorized'
  | 'resendPhoneConfirmation'
  | 'confirmEmail'
  | 'confirmEmailWithPassword'
  | 'forgotPassword'
  | 'login'
  | 'loginRefresh'
  | 'cookieSignOut'
  | 'cookieSignIn'
  | 'changePassword'
  | 'myInfo'
  | 'addMntcTeamMember'
  | 'addSuperTeamMember'
  | 'refreshTokenRevoke'
  | 'resendEmailConfirmation'
  | 'resendEmailConfirmationAuthorized'
  | 'resendEmailConfirmation'
  | 'resendTwoFactor'
  | 'resendTwoFactorCookie'
  | 'twoFactorVerification'
  | 'twoFactorVerificationCookie'
  | 'twoFactorSetupData'
  | 'twoFactorAuthAppEmailComplete'
  | 'twoFactorAuthAppComplete'
  | 'enableTwoFactorAuthentication'
  | 'disableTwoFactorAuthentication'
  | 'resetPassword';

//#################################################//

export class AccountController {
  
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
