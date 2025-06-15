import { AccountControllerRoutes } from "./controllers/account.controller";
import { UserMgmtControllerRoutes as UserMgmtController } from "./controllers/user-mgmt.controller";
import { environment } from '../../../../environments/environment';

export class ServerRoutes {
  
  static readonly BASE_URL = environment.serverUrl

  //controllers
  static readonly Account = AccountControllerRoutes
  static readonly UserMgmt = UserMgmtController

}