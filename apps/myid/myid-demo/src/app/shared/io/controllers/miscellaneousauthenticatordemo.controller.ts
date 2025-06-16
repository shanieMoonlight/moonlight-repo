const CONTROLLER = 'MiscellaneousAuthenticatorDemo';

type ACTIONS =
  | 'leader'
  | 'positionMinimum'
  | 'positionMinimumWithLevel'
  | 'positionMinimumResourceFilter'
  | 'leaderResourceFilter'
  | 'policyExample';

//#################################################//

export class MiscellaneousAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
