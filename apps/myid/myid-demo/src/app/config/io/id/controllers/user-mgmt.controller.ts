
//#################################################//

const CONTROLLER = 'usermanagement';

type ACTIONS =
  | 'login'
  | 'googlelogin'
  | 'confirmemail'
  | 'confirmphone'
  | 'loginrefresh'

//#################################################//

export class UserMgmtControllerRoutes {

  public static readonly Controller = CONTROLLER;

  static action = (action?: ACTIONS) => action 
  
} 
