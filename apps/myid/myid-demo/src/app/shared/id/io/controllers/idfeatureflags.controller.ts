const CONTROLLER = 'IdFeatureFlags';

type ACTIONS =
  | 'add'
  | 'edit'
  | 'delete'
  | 'getAll'
  | 'get'
  | 'getAllByName'
  | 'getByName'
  | 'page';

//#################################################//

export class IdFeatureFlagsController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
