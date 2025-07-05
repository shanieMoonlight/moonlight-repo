const CONTROLLER = 'MiscellaneousAuthenticatorDemo';

type ACTIONS =
  | 'leader'
  | 'position-minimum'
  | 'position-minimum-with-level'
  | 'position-minimum-resource-filter'
  | 'leader-resource-filter'
  | 'policy-example';

//#################################################//

export class MiscellaneousAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
