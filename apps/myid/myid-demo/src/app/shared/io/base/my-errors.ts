// import { ModelStateErrors } from './model-state-errors';
// import { AppError } from './app-error';
// import { StatusCodes } from '@inigo/gen-helpers/classes';

import { StatusCodes } from "./status-codes";

//####################################//

export const GATEWAY_TIMEOUT_ERROR_MESSAGE =
  'Server may be down.\r\nTry again and contact us if problem persists';
export const BAD_GATEWAY_ERROR_MESSAGE =
  'The server encountered a temporary error and could not complete your request.\r\nTry again and contact us if problem persists';
export const INTERNAL_SERVER_ERROR_MESSAGE =
  'The server encountered a temporary error and could not complete your request.\r\nTry again and contact us if problem persists';
export const UNREADABLE_RESPONSE_ERROR_MESSAGE =
  "Can't read the server response. There may be a problem with the server.\r\nTry again and contact us if problem persists";
export const UNKNOWN_ERROR_MESSAGE =
  'Something went wrong.\r\nTry refreshing the page and contact us if problem persists';

//####################################//

export class HttpError {
 constructor(
     public originalError?: any,
     public statusCode?: number,
     public title?: string,
     public message?: string
  ) { } 

  //----------------------------//

  /**
   * Returns a specific HttpError if it matches the stausCode.
   * Used when we want to create our own message for the error.
   */
  static getNonBadRequestErrorFromStatusCode(statusCode: number): HttpError {
    //Not found??
    if (statusCode === StatusCodes.NOT_FOUND) return new NotFoundError();

    //Unauthorized??
    if (statusCode === StatusCodes.UNAUTHORIZED) return new UnauthorizedError();

    //Forbidden??
    if (statusCode === StatusCodes.FORBIDDEN) return new ForbiddenError();

    //Gateway Timeout??
    if (statusCode === StatusCodes.GATEWAY_TIMEOUT)
      return new GatewayTimeoutError();

    //BadGateway ??
    if (statusCode === StatusCodes.BAD_GATEWAY) return new BadGatewayError();

    //InternalServer ??
    if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR)
      return new InternalServerError();

    //InternalServer ??
    if (statusCode === StatusCodes.PRECONDITION_REQUIRED)
      return new PreconditionRequiredError();

    return new UnknownError();
  } //getErrorFromStatusCode
} //Cls

//####################################//

export class UnauthorizedError extends HttpError {
  constructor(originalError?: any) {
    super(originalError, StatusCodes.UNAUTHORIZED, 'Unauthorized', 'Unauthorized');
  }
} //Cls

//####################################//

export class ForbiddenError extends HttpError {
  constructor(originalError?: any) {
    super(originalError, StatusCodes.FORBIDDEN, 'Forbidden', 'Forbidden');
  }
} //Cls

//####################################//

export class BadRequestError extends HttpError {
  constructor(
    public override message: string,
    public modelStateErrors: unknown = {},
    public override originalError?: any
  ) {
    super(originalError, StatusCodes.BAD_REQUEST, 'Bad Request', message);
  }
} //Cls

//####################################//

export class NotFoundError extends HttpError {
  constructor(originalError?: any) {
    super(
      originalError,
      StatusCodes.NOT_FOUND,
      'Not Found',
      originalError?.message ?? 'Not Found'
    );
  }
} //Cls

//####################################//

export class GatewayTimeoutError extends HttpError {
  constructor(originalError?: any) {
    super(
      originalError,
      StatusCodes.GATEWAY_TIMEOUT,
      'Gateway Timeout',
      GATEWAY_TIMEOUT_ERROR_MESSAGE
    );
  }
} //Cls

//####################################//

export class BadGatewayError extends HttpError {
  constructor(originalError?: any) {
    super(
      originalError,
      StatusCodes.BAD_GATEWAY,
      'Gateway Timeout',
      BAD_GATEWAY_ERROR_MESSAGE
    );
  }
} //Cls

//####################################//

export class PreconditionRequiredError extends HttpError {
  constructor(
    originalError?: any,
    originalMsg: string | undefined = undefined
  ) {
    super(
      originalError,
      StatusCodes.BAD_GATEWAY,
      'Precondition Required',
      originalMsg
    );
  }
} //Cls

//####################################//

export class InternalServerError extends HttpError {
  constructor(
    originalError?: any,
    originalMsg: string | undefined = undefined
  ) {
    const msg = originalMsg ? originalMsg : INTERNAL_SERVER_ERROR_MESSAGE;
    super(
      originalError,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      msg
    );
  }
} //Cls

//####################################//

export class UnknownError extends HttpError {
  constructor(
    originalError?: any,
    originalMsg: string | undefined = undefined
  ) {
    const msg = originalMsg ? originalMsg : UNKNOWN_ERROR_MESSAGE;
    super(originalError, StatusCodes.UNKNOWN_ERROR, 'Unknown Error', msg);
  }
} //Cls

//####################################//

/** Should never happen if server api emits objects */
export class UnreadableResponseError extends HttpError {
  constructor(originalError?: any) {
    super(
      originalError,
      666,
      'Unreadable response',
      UNREADABLE_RESPONSE_ERROR_MESSAGE
    )
   console.log('WTF');
   
  }
  
} //Cls

//####################################//
