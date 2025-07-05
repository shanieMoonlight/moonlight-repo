//#################################################//
/** Paths and Params that will be used in multiple levels of AuthTeams */

export class MyIdRouteInfo {

  static Params = class {
    static readonly REDIRECT_URL_KEY = 'redirect';
    static readonly LOGIN_EXTRA_INFO = 'extrainfo';
    static readonly USER_ID_KEY = 'userid';
    static readonly CONFIRMATION_TOKEN_KEY = 'confirmationtoken';
    static readonly RESET_PWD_TOKEN_KEY = 'resettoken';
    static readonly TWO_FACTOR_TOKEN_KEY = 'twofactortoken';
    static readonly TWO_FACTOR_PROVIDER_KEY = 'twofactorprovider';
    static readonly SWAGGER_TOKEN_KEY = 'tkn';
    static readonly HANGFIRE_TOKEN_KEY = 'tkn';
    static readonly EXTERNAL_PAGE_TOKEN_KEY = 'tkn';
  };

}
