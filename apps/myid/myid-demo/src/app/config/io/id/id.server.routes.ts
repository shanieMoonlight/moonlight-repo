import { AccountControllerRoutes } from "./controllers/account.controller";
import { UserMgmtControllerRoutes as UserMgmtController } from "./controllers/user-mgmt.controller";

export class IdentityServerRoutes {
  
  static readonly BASE_URL = 'https://localhost:44339/identity';

  //controllers
  static readonly Account = AccountControllerRoutes
  static readonly UserMgmt = UserMgmtController

}