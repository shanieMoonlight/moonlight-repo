const CONTROLLER = 'AuthenticatorDemo';

type ACTIONS = 'endpoints' | 'testInfo';

//#################################################//

export class AuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
