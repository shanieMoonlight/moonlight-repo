const CONTROLLER = 'Teams';

type ACTIONS =
  | 'addCustomerToTeam'
  | 'add'
  | 'edit'
  | 'updatePositionRange'
  | 'delete'
  | 'getAll'
  | 'getSuper'
  | 'getMntc'
  | 'get'
  | 'getAllByName'
  | 'page'
  | 'addSubscription'
  | 'getSubscription'
  | 'removeSubscription'
  | 'recordSubscriptionPayment'
  | 'getDevice'
  | 'addDevice'
  | 'removeDevice'
  | 'updateDevice';

//#################################################//

export class TeamsController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
