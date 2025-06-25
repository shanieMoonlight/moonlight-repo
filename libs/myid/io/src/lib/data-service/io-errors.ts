import { HttpErrorResponse } from '@angular/common/http';
import { StatusCodes } from './status-codes';

//####################################//

function validationErrorsToMessage(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => messages.join(' '))
    .join(' ');
}

//####################################//

interface MessageResponse {
  message?: string;
}

//####################################//

export const UNKNOWN_ERROR_CODE = 666
export const APPLICATION_ERROR_HEADER = 'Application-Error';

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
  static getErrorFromHttpResponse(httpErrorResponse: HttpErrorResponse): HttpError {

    //1. Do we have any idea what happened
    if (!httpErrorResponse || (!httpErrorResponse.headers && !httpErrorResponse.error))
      return new HttpError(httpErrorResponse, UNKNOWN_ERROR_CODE, 'Server Error');

    const error = httpErrorResponse?.error;

    const statusCode = httpErrorResponse.status
      ? httpErrorResponse.status
      : UNKNOWN_ERROR_CODE;

    const statusText = httpErrorResponse.statusText
      ? httpErrorResponse.statusText
      : 'Unknown Error';


    // 2. Check for application error header first
    const applicationErrorMsg = httpErrorResponse.headers.get(APPLICATION_ERROR_HEADER);
    if (applicationErrorMsg) {
      return new HttpError(
        httpErrorResponse,
        statusCode,
        statusText,
        applicationErrorMsg
      )
    }

    //3. If error is a string just pass it on as a message
    if (typeof error === 'string')
      return new HttpError(httpErrorResponse, statusCode, statusText, error);

    //4. Check Status Codes
    const errorMessage = error?.message;

    if (statusCode === StatusCodes.BAD_REQUEST)
      return new BadRequestError(errorMessage, error?.errors, error);

    if (statusCode === StatusCodes.NOT_FOUND)
      return new NotFoundError(error);

    if (statusCode === StatusCodes.UNAUTHORIZED)
      return new UnauthorizedError(error);

    if (statusCode === StatusCodes.FORBIDDEN)
      return new ForbiddenError(error);

    if (statusCode === StatusCodes.GATEWAY_TIMEOUT)
      return new GatewayTimeoutError(error);

    if (statusCode === StatusCodes.BAD_GATEWAY)
      return new BadGatewayError(error);

    if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR)
      return new InternalServerError(error, errorMessage);

    if (statusCode === StatusCodes.PRECONDITION_REQUIRED)
      return new PreconditionRequiredError(
        httpErrorResponse,
        errorMessage,
        error,
        error?.twoFactorVerificationRequired
      );

    // Defensive: Unreadable response
    if (statusCode === StatusCodes.OK)
      return new UnreadableResponseError(error);

    //5. Fallback to generic HttpError
    return new HttpError(
      httpErrorResponse,
      statusCode,
      statusText,
      httpErrorResponse?.error?.message
    );
  }
}

//####################################//

export class UnauthorizedError extends HttpError {
  constructor(originalError?: unknown) {
    super(
      originalError,
      StatusCodes.UNAUTHORIZED,
      'Unauthorized',
      'Unauthorized'
    );
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
    message?: string,
    public validationErrors?: Record<string, string[]>,
    originalError?: unknown
  ) {
    super(
      originalError,
      StatusCodes.BAD_REQUEST,
      'Bad Request',
      message || validationErrorsToMessage(validationErrors ?? {})
    );
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
      'Bad Gateway',
      BAD_GATEWAY_ERROR_MESSAGE
    );
  }
}

//####################################//

export class PreconditionRequiredError extends HttpError {
  constructor(
    originalError?: unknown,
    originalMsg: string | undefined = undefined,
    public payload?: unknown,
    public twoFactorRequired: boolean = false
  ) {
    super(
      originalError,
      StatusCodes.PRECONDITION_REQUIRED,
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
    );
  }
} //Cls

//####################################//
