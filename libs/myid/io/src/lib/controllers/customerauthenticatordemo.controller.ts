const CONTROLLER = 'CustomerAuthenticatorDemo';

type ACTIONS =
  | 'customer'
  | 'customerMinimum'
  | 'customerLeader'
  | 'customerLeaderMinimum'
  | 'customerResourceFilter';

//#################################################//

export class CustomerAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
