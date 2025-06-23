import { HttpClient, HttpErrorResponse, HttpStatusCode, } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateUtils } from './date-utils';
import { Identifier } from './identifier';
import {
  BadRequestError,
  HttpError,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NotFoundError,
  PreconditionRequiredError,
  UnreadableResponseError,
} from './io-errors';
import { UrlUtils } from './url-utils';
import { MyIdIoLoggerService } from './io-logger';

/**
 * Base Service for all http services.
 * Provides basic CRUD operations and error handling. *
 **/
export abstract class ABaseHttpService {

  protected _http = inject(HttpClient);
  private  _logger = inject(MyIdIoLoggerService);

  constructor(private url: string) { }

  //----------------------//

  /**
   * Get some resources - Action = 'get'
   * @param opts http options
   */
  protected _get<T>(opts = {}): Observable<T> {
    return this._http.get<T>(this.url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _getById<T>(
    ids: Identifier | Identifier[],
    opts = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, ...this.idsToArray(ids));
    return this._http.get<T>(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  /**
   * Adds params to url then GETs
   * @param params QueryP Paramaters as string
   * @param opts http options
   * @returns Observable<?>
   */
  protected _getQueryParams<T>(params: string, opts = {}): Observable<T> {
    return this._http.get<T>(this.url + params, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//
  /**
   * Get a resource
   * @param action The method on the controller
   * @param date resource identifier / date
   * @param opts http options
   */
  protected _getByDate<T>(date: Date, opts = {}): Observable<T> {
    const url = UrlUtils.combine(this.url, DateUtils.toIsoString(date));
    return this._http.get<T>(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _getUrl<T>(url: string, opts = {}): Observable<T> {
    return this._http.get<T>(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  /**
   * Get some resources
   * @param action The method on the controller
   * @param opts http options
   */
  protected _getAction<T>(action: string, opts = {}): Observable<T> {
    const url = UrlUtils.combine(this.url, action);
    return this._http.get<T>(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  /**
   * Get a resource
   * @param action The method on the controller
   * @param id resource identifier
   * @param opts http options
   */
  protected _getActionById<T>(
    action: string,
    ids: Identifier | Identifier[],
    opts = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action, ...this.idsToArray(ids));
    return this._http.get<T>(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  /**
   * Get a resource
   * @param action The method on the controller
   * @param date resource identifier / date
   * @param opts http options
   */
  protected _getActionByDate<T>(
    action: string,
    date: Date,
    opts = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action, DateUtils.toIsoString(date));
    return this._http.get<T>(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _post<T>(resource: unknown, opts = {}): Observable<T> {
    return this._http.post<T>(this.url, resource, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  /**
   * Post a resource
   * @param action The method on the controller
   * @param resource The payload
   * @param opts http options
   * @p
   */
  protected _postAction<T>(
    action: string,
    resource: unknown,
    opts = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action);
    return this._http.post<T>(url, resource, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _patch<T>(resource: unknown, opts = {}): Observable<T> {
    const url = UrlUtils.combine(this.url);
    return this._http.patch<T>(url, resource, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _patchAction<T>(
    action: string,
    resource: unknown,
    opts = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action);
    return this._http.patch<T>(url, resource, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _delete<T>(
    ids: Identifier | Identifier[],
    opts = {}
  ): Observable<T> {
    const deleteUrl = UrlUtils.combine(this.url, ...this.idsToArray(ids));
    return this._http.delete<T>(deleteUrl, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//
  /**
   * Delete a resource
   * @param action The method on the controller
   * @param id resource identifier
   * @param opts http options
   */
  protected _deleteAction<T>(
    action: string,
    ids: Identifier | Identifier[],
    opts = {}
  ): Observable<T> {
    const deleteUrl = UrlUtils.combine(
      this.url,
      action,
      ...this.idsToArray(ids)
    );
    return this._http.delete<T>(deleteUrl, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected handleError(httpErrorResponse: HttpErrorResponse) {
    
      this._logger.error('httpErrorResponse', httpErrorResponse);

    //Do we have any idea what happened
    if (
      !httpErrorResponse ||
      (!httpErrorResponse.headers && !httpErrorResponse.error)
    )
      return throwError(
        () => new HttpError(httpErrorResponse, 666, 'Server Error')
      );

    const statusCode = httpErrorResponse.status
      ? httpErrorResponse.status
      : 666;

    const statusText = httpErrorResponse.statusText
      ? httpErrorResponse.statusText
      : 'Unknown Error';

    //This is where the model state errors would go
    const error = httpErrorResponse?.error;

    //This means we're having a problem reading the response
    if (statusCode === HttpStatusCode.Ok) {
      return throwError(() => new UnreadableResponseError(error));
    }

    if (statusCode === HttpStatusCode.NotFound)
      return throwError(() => new NotFoundError(error));

    if (statusCode === HttpStatusCode.PreconditionRequired) {
      return throwError(() =>
        new PreconditionRequiredError(
          httpErrorResponse,
          error?.message,
          error, // payload (contains twoFactorToken, etc.)
          error.twoFactorVerificationRequired
        )
      );
    }

    if (statusCode === HttpStatusCode.BadRequest) {
      return throwError(() =>
        new BadRequestError(
          error?.message,
          error.errors,
          error,
        )
      );
    }


    //Known error?
    const nonBadRequestHttpError = HttpError.getNonBadRequestErrorFromStatusCode(statusCode);

    //if error IS the message, get it.
    if (error && typeof error === 'string')
      nonBadRequestHttpError.message = error;

    //if error HAS a message, get it.
    if (error?.message) nonBadRequestHttpError.message = error.message;

    // //if httpErrorResponse has a message, use it.
    // if (httpErrorResponse?.message)
    //     nonBadRequestHttpError.message = httpErrorResponse.message

    //If it's an InternalServerError and still no message: Add our own.
    //use '==' in case stasusCode is a string
    // tslint:disable-next-line: triple-equals
    if (
      !nonBadRequestHttpError?.message &&
      statusCode == HttpStatusCode.InternalServerError
    )
      nonBadRequestHttpError.message = INTERNAL_SERVER_ERROR_MESSAGE;

    //Just pass on Non-BadRequestErrors
    if (nonBadRequestHttpError)
    return  throwError(() => nonBadRequestHttpError);


    //Look for custom sever error header
    let applicationErrorMsg =
      httpErrorResponse.headers.get('Application-Error') ?? '';

    //Either applicationError in header or model error in body
    if (applicationErrorMsg)
      return throwError(
        () =>
          new HttpError(
            httpErrorResponse,
            statusCode,
            statusText,
            applicationErrorMsg
          )
      );

    //If error is a string just pass it on as a message
    if (typeof error === 'string')
      return throwError(
        () => new HttpError(httpErrorResponse, statusCode, statusText, error)
      );

    //If we got an embedded error message use it
    if (httpErrorResponse?.error?.message)
      return throwError(
        () =>
          new HttpError(
            httpErrorResponse,
            statusCode,
            statusText,
            httpErrorResponse?.error?.message
          )
      );

    //If it's not there look for other message
    if (!applicationErrorMsg)
      applicationErrorMsg = httpErrorResponse?.message
        ? httpErrorResponse.message
        : '';

    //Last resort
    return throwError(
      () =>
        new HttpError(
          httpErrorResponse,
          statusCode,
          statusText,
          applicationErrorMsg
        )
    );
  }

  //----------------------//

  protected extractData<T>(res: T): T {
    return res;
    // return res.text() ? res.json() : {};
  }

  //----------------------//

  private idsToArray(ids: Identifier | Identifier[]): string[] {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    return idsArray.map((x) => x?.toString());
  }

  //----------------------//


} //Cls
