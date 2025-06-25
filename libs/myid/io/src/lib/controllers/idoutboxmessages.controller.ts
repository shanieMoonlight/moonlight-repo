const CONTROLLER = 'IdOutboxMessages';

type ACTIONS = 'getAll' | 'get' | 'getAllByType' | 'page';

//#################################################//

export class IdOutboxMessagesController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
