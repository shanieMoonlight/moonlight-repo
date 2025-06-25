const CONTROLLER = 'MaintenanceAuthenticatorDemo';

type ACTIONS =
  | 'mntc'
  | 'mntc-minimum'
  | 'mntc-leader'
  | 'mntc-leader-minimum'
  | 'mntc-minimum-or-dev'
  | 'mntc-resource-filter';

//#################################################//

export class MaintenanceAuthenticatorDemoController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
