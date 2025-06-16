const CONTROLLER = 'IdSubscriptionPlans';

type ACTIONS =
  | 'add'
  | 'edit'
  | 'delete'
  | 'getAll'
  | 'get'
  | 'getByName'
  | 'getAllByName'
  | 'page'
  | 'addFeature'
  | 'addFeatures'
  | 'removeFeature'
  | 'removeFeatures';

//#################################################//

export class IdSubscriptionPlansController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
