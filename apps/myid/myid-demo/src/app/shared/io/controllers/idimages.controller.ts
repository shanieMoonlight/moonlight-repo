const CONTROLLER = 'IdImages';

type ACTIONS = 'emailConfirmed' | 'phoneConfirmed' | 'fallbackLogo';

//#################################################//

export class IdImagesController {
  public static readonly Controller = CONTROLLER;

  static action = (action: ACTIONS): string => action;
}
