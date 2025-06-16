const CONTROLLER = 'SuperAuthenticatorDemo';

type ACTIONS =
  | 'super'
  | 'superMinimum'
  | 'superLeader'
  | 'superMinimumOrDev'
  | 'superResourceFilter';

//#################################################//

export class SuperAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
