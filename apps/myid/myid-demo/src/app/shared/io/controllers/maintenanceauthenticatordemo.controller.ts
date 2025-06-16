const CONTROLLER = 'MaintenanceAuthenticatorDemo';

type ACTIONS =
  | 'mntc'
  | 'mntcMinimum'
  | 'mntcLeader'
  | 'mntcLeaderMinimum'
  | 'mntcMinimumOrDev'
  | 'mntcResourceFilter';

//#################################################//

export class MaintenanceAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
