const CONTROLLER = 'CookieDebugging';

type ACTIONS = 'cookieInfo';

//#################################################//

export class CookieDebuggingController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
