import { StatusCodes } from "./status-codes";

//####################################//

interface MessageResponse { message?: string }

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
     public originalError?: unknown,
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
    
    if (statusCode === StatusCodes.NOT_FOUND) 
      return new NotFoundError();

    
    if (statusCode === StatusCodes.UNAUTHORIZED) 
      return new UnauthorizedError();

    if (statusCode === StatusCodes.FORBIDDEN) 
      return new ForbiddenError();

    if (statusCode === StatusCodes.GATEWAY_TIMEOUT)
      return new GatewayTimeoutError();

    if (statusCode === StatusCodes.BAD_GATEWAY) 
      return new BadGatewayError();

    if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR)
      return new InternalServerError();

    if (statusCode === StatusCodes.PRECONDITION_REQUIRED)
      return new PreconditionRequiredError();

    return new UnknownError();
  } 
  
} 

//####################################//


export class UnauthorizedError extends HttpError {
  constructor(originalError?: unknown) {
    super(originalError, StatusCodes.UNAUTHORIZED, 'Unauthorized', 'Unauthorized');
  }
} 

//####################################//


export class ForbiddenError extends HttpError {
  constructor(originalError?: unknown) {
    super(originalError, StatusCodes.FORBIDDEN, 'Forbidden', 'Forbidden');
  }
} //Cls


//####################################//


export class BadRequestError extends HttpError {
  constructor(
    public override message: string,
    public modelStateErrors: unknown = {},
    public override originalError?: unknown
  ) {
    super(originalError, StatusCodes.BAD_REQUEST, 'Bad Request', message);
  }
} 

//####################################//


export class NotFoundError extends HttpError {
  constructor(originalError?: unknown) {
    super(
      originalError,
      StatusCodes.NOT_FOUND,
      'Not Found',
      (originalError as MessageResponse)?.message ?? 'Not Found'
    );
  }
} 

//####################################//


export class GatewayTimeoutError extends HttpError {
  constructor(originalError?: unknown) {
    super(
      originalError,
      StatusCodes.GATEWAY_TIMEOUT,
      'Gateway Timeout',
      GATEWAY_TIMEOUT_ERROR_MESSAGE
    );
  }
} 

//####################################//


export class BadGatewayError extends HttpError {
  constructor(originalError?: unknown) {
    super(
      originalError,
      StatusCodes.BAD_GATEWAY,
      'Gateway Timeout',
      BAD_GATEWAY_ERROR_MESSAGE
    );
  }
} 

//####################################//


export class PreconditionRequiredError extends HttpError {
  constructor(
    originalError?: unknown,
    originalMsg: string | undefined = undefined
  ) {
    super(
      originalError,
      StatusCodes.BAD_GATEWAY,
      'Precondition Required',
      originalMsg
    );
  }
} 

//####################################//


export class InternalServerError extends HttpError {
  constructor(
    originalError?: unknown,
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
} 

//####################################//


export class UnknownError extends HttpError {
  constructor(
    originalError?: unknown,
    originalMsg: string | undefined = undefined
  ) {
    const msg = originalMsg ? originalMsg : UNKNOWN_ERROR_MESSAGE;
    super(originalError, StatusCodes.UNKNOWN_ERROR, 'Unknown Error', msg);
  }
} //Cls

//####################################//

/** Should never happen if server api emits objects */
export class UnreadableResponseError extends HttpError {
  constructor(originalError?: unknown) {
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
