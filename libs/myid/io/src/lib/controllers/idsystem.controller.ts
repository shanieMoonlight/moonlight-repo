const CONTROLLER = 'IdSystem';

type ACTIONS =
  | 'initialize'
  | 'migrate'
  | 'publicSigningKey'
  | 'emailRoutes'
  | 'getTwoFactorProviders'
  | 'globalSettings';

//#################################################//

export class IdSystemController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
