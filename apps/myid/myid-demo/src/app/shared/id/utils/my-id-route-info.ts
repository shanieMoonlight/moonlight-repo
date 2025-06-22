//#################################################//
/** Paths and Params that will be used in multiple levels of AuthTeams */

export class MyIdRouteInfo {

  static Params = class {
    static readonly REDIRECT_URL_KEY = 'returnurl';
    static readonly LOGIN_EXTRA_INFO = 'extrainfo';
    static readonly USER_ID = 'userid';
    static readonly CONFIRMATION_TOKEN = 'confirmationtoken';
    static readonly RESET_PWD_TOKEN = 'resettoken';
    static readonly TWO_FACTOR_TOKEN = 'twofactortoken';
  };

}
