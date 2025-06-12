// AUTO-GENERATED FILE. DO NOT EDIT.

//#################################################//

const CONTROLLER = 'Account';

type ACTIONS =
  | 'CloseAccount'
  | 'MyInfoCustomer'
  | 'RegisterCustomer'
  | 'CreateCustomer'
  | 'AddCustomerTeamMember'
  | 'AddCustomerTeamMemberMntc'
  | 'GoogleLogin'
  | 'ConfirmPhone'
  | 'ResendPhoneConfirmation'
  | 'ResendPhoneConfirmation'
  | 'ResendPhoneConfirmation'
  | 'ConfirmEmail'
  | 'ConfirmEmailWithPassword'
  | 'ForgotPassword'
  | 'Login'
  | 'LoginRefresh'
  | 'CookieSignOut'
  | 'CookieSignIn'
  | 'ChangePassword'
  | 'MyInfo'
  | 'AddMntcTeamMember'
  | 'AddSuperTeamMember'
  | 'RefreshTokenRevoke'
  | 'ResendEmailConfirmation'
  | 'ResendEmailConfirmation'
  | 'ResendEmailConfirmation'
  | 'TwoFactorResend'
  | 'TwoFactorVerification'
  | 'TwoFactorSetupData'
  | 'TwoFactorAuthAppEmailComplete'
  | 'TwoFactorAuthAppComplete'
  | 'EnableTwoFactorAuthentication'
  | 'DisableTwoFactorAuthentication'
  | 'ResetPassword'

//#################################################//

export class AccountControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'AuthenticatorDemo';

type ACTIONS =
  | 'endpoints'
  | 'test-info'

//#################################################//

export class AuthenticatorDemoControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'CookieDebugging';

type ACTIONS =
  | 'cookie-info'

//#################################################//

export class CookieDebuggingControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'CustomerAuthenticatorDemo';

type ACTIONS =
  | 'customer'
  | 'customer-minimum'
  | 'customer-leader'
  | 'customer-leader-minimum'
  | 'customer-resource-filter'

//#################################################//

export class CustomerAuthenticatorDemoControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'IdFeatureFlags';

type ACTIONS =
  | 'Add'
  | 'Edit'
  | 'Delete'
  | 'GetAll'
  | 'Get'
  | 'GetAllByName'
  | 'GetByName'
  | 'Page'

//#################################################//

export class IdFeatureFlagsControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'IdImages';

type ACTIONS =
  | 'EmailConfirmed'
  | 'PhoneConfirmed'
  | 'FallbackLogo'

//#################################################//

export class IdImagesControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'IdMaintenance';

type ACTIONS =
  | 'Initialize'
  | 'Migrate'
  | 'PublicSigningKey'
  | 'EmailRoutes'
  | 'GetTwoFactorProviders'
  | 'GlobalSettings'

//#################################################//

export class IdMaintenanceControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'IdOutboxMessages';

type ACTIONS =
  | 'GetAll'
  | 'Get'
  | 'GetAllByType'
  | 'Page'

//#################################################//

export class IdOutboxMessagesControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'IdSubscriptionPlans';

type ACTIONS =
  | 'Add'
  | 'Edit'
  | 'Delete'
  | 'GetAll'
  | 'Get'
  | 'GetByName'
  | 'GetAllByName'
  | 'Page'
  | 'AddFeature'
  | 'AddFeatures'
  | 'RemoveFeature'
  | 'RemoveFeatures'

//#################################################//

export class IdSubscriptionPlansControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'MaintenanceAuthenticatorDemo';

type ACTIONS =
  | 'mntc'
  | 'mntc-minimum'
  | 'mntc-leader'
  | 'mntc-leader-minimum'
  | 'mntc-minimum-or-dev'
  | 'mntc-resource-filter'

//#################################################//

export class MaintenanceAuthenticatorDemoControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'MiscellaneousAuthenticatorDemo';

type ACTIONS =
  | 'leader'
  | 'position-minimum'
  | 'position-minimum-with-level'
  | 'position-minimum-resource-filter'
  | 'leader-resource-filter'
  | 'policy-example'

//#################################################//

export class MiscellaneousAuthenticatorDemoControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'SuperAuthenticatorDemo';

type ACTIONS =
  | 'super'
  | 'super-minimum'
  | 'super-leader'
  | 'super-minimum-or-dev'
  | 'super-resource-filter'

//#################################################//

export class SuperAuthenticatorDemoControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'Teams';

type ACTIONS =
  | 'AddCustomerToTeam'
  | 'Add'
  | 'Edit'
  | 'UpdatePositionRange'
  | 'Delete'
  | 'GetAll'
  | 'GetSuper'
  | 'GetMntc'
  | 'Get'
  | 'GetAllByName'
  | 'Page'
  | 'AddSubscription'
  | 'GetSubscription'
  | 'RemoveSubscription'
  | 'RecordSubscriptionPayment'
  | 'GetDevice'
  | 'AddDevice'
  | 'RemoveDevice'
  | 'UpdateDevice'

//#################################################//

export class TeamsControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
//#################################################//

const CONTROLLER = 'UserManagement';

type ACTIONS =
  | 'DeleteCustomer'
  | 'GetCustomers'
  | 'GetCustomersPage'
  | 'GetCustomer'
  | 'UpdatePosition'
  | 'UpdateMember'
  | 'UpdateMyTeamLeader'
  | 'UpdateLeader'
  | 'UpdateTwoFactorProvider'
  | 'UpdateAddress'
  | 'DeleteMntcMember'
  | 'DeleteSuperMember'
  | 'DeleteTeamMember'
  | 'GetTeamMembers'
  | 'GetMntcTeamMembers'
  | 'GetSuperTeamMembers'
  | 'GetMntcTeamMembersPage'
  | 'GetSuperTeamMembersPage'
  | 'GetMyTeamMember'
  | 'GetTeamMember'
  | 'GetSuperTeamMember'
  | 'GetMntcTeamMember'

//#################################################//

export class UserManagementControllerRoutes {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action
}
