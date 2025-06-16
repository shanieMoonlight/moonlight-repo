const CONTROLLER = 'Aardvaark';

type ACTIONS = 'index' | 'get' | 'post' | 'patch' | 'delete' | 'get';

//#################################################//

export class AardvaarkController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
