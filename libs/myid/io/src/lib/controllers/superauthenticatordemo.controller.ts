const CONTROLLER = 'SuperAuthenticatorDemo';

type ACTIONS =
  | 'super'
  | 'super-minimum'
  | 'super-leader'
  | 'super-minimum-or-dev'
  | 'super-resource-filter';

//#################################################//

export class SuperAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
