
import { AccountControllerRoutes } from "./io/id/controllers/account.controller";
import { UserMgmtControllerRoutes } from "./io/id/controllers/user-mgmt.controller";




export class IoConfig {

    public Identity = class {
        static readonly BASE_URL = 'https://localhost:44339//identity';

        static readonly Account = AccountControllerRoutes
        static readonly  UserMgmt = UserMgmtControllerRoutes
    }

}