

//#################################################//


const CONTROLLER = 'account';

type ACTIONS =
  | 'confirmEmail'
  | 'confirmPhone'
  | 'loginRefresh'
  | 'googleLogin'
  | 'googleCookieSignin'
  | 'confirmEmailWithPassword'
  | 'confirmPhone'
  | 'forgotPassword'
  | 'login'
  | 'changePassword'
  | 'myInfo'
  | 'myInfoCustomer'
  | 'registerCustomer'
  | 'createCustomer'
  | 'registerMntcTeamLeader'
  | 'addMntcTeamMember'
  | 'addSuperTeamMember'
  | 'addCustomerTeamMember'
  | 'closeAccount'
  | 'resendEmailConfirmation'
  | 'resendPhoneConfirmation'
  | 'twoFactorResend'
  | 'twoFactorVerification'
  | 'twoFactorSetupData'
  | 'twoFactorAuthAppEmailComplete'
  | 'twoFactorAuthAppComplete'
  | 'enableTwoFactorAuthentication'
  | 'disableTwoFactorAuthentication'
  | 'resetPassword'
  | 'testSe'


//#################################################//


export class AccountControllerRoutes {

  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
  
} 
