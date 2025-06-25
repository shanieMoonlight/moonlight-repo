
import { environment } from '../../../../../environments/environment';
import { AccountController } from './account.controller';
import { AuthenticatorDemoController } from './authenticatordemo.controller';
import { CookieDebuggingController } from './cookiedebugging.controller';
import { CustomerAuthenticatorDemoController } from './customerauthenticatordemo.controller';
import { IdFeatureFlagsController } from './idfeatureflags.controller';
import { IdImagesController } from './idimages.controller';
import { IdOutboxMessagesController } from './idoutboxmessages.controller';
import { IdSubscriptionPlansController } from './idsubscriptionplans.controller';
import { IdSystemController } from './idsystem.controller';
import { MaintenanceAuthenticatorDemoController } from './maintenanceauthenticatordemo.controller';
import { MiscellaneousAuthenticatorDemoController } from './miscellaneousauthenticatordemo.controller';
import { SuperAuthenticatorDemoController } from './superauthenticatordemo.controller';
import { TeamsController } from './teams.controller';
import { UserManagementController } from './usermanagement.controller';

export class ServerRoutes {
  static readonly BASE_URL = environment.serverUrl;

  //controllers
  static readonly Account = AccountController;
  static readonly AuthenticatorDemo = AuthenticatorDemoController;
  static readonly CookieDebugging = CookieDebuggingController;
  static readonly CustomerAuthenticatorDemo = CustomerAuthenticatorDemoController;
  static readonly IdFeatureFlags = IdFeatureFlagsController;
  static readonly IdImages = IdImagesController;
  static readonly IdOutboxMessages = IdOutboxMessagesController;
  static readonly IdSubscriptionPlans = IdSubscriptionPlansController;
  static readonly IdSystem = IdSystemController;
  static readonly MaintenanceAuthenticatorDemo = MaintenanceAuthenticatorDemoController;
  static readonly MiscellaneousAuthenticatorDemo = MiscellaneousAuthenticatorDemoController;
  static readonly SuperAuthenticatorDemo = SuperAuthenticatorDemoController;
  static readonly Teams = TeamsController;
  static readonly UserManagement = UserManagementController;
}
