import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
// import { HttpServicesConfig, HttpServicesConfigService } from '@inigo/http-services/config';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { to_dd_MMM_YYYY } from './data.io.service.utils';
import { HttpError, INTERNAL_SERVER_ERROR_MESSAGE, NotFoundError, UnreadableResponseError } from './my-errors';
import { Identifier } from '../models/identifier';

//################################//
// RouteUtility.combine

/**
 * Base Service for all http services.
 * Provides basic CRUD operations and error handling. *  
 **/
export abstract class BaseDataService {

  protected _http = inject(HttpClient)

  constructor(private url: string) {
    if (isDevMode()) {
      // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }
  }

  //------------------------------//

  /**
   * Get some resources - Action = 'get'
   * @param opts http options
   */
  protected get(opts = {}) {
    return this._http.get(this.url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected getTimeout(id: string | number, timeoutMillis: number = 60000, opts = {}) {
    const url = this.url + '/' + id;

    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      timeout(timeoutMillis),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Adds params to url then GETs
   * @param params QueryP Paramaters as string
   * @param opts http options
   * @returns Observable<?>
   */
  protected getQueryParams(params: string, opts = {}) {
    return this._http.get(this.url + params, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected getById(id: string | number, opts = {}) {
    const url = this.url + '/' + id;

    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Get a resource
   * @param action The method on the controller
   * @param date resource identifier / date
   * @param opts http options
   */
  protected getByDate(date: Date, opts = {}) {
    const url = this.url + '/' + to_dd_MMM_YYYY(date);

    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected getUrl(url: string, opts = {}) {
    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Get some resources
   * @param action The method on the controller
   * @param opts http options
   */
  protected getAction(action: string, opts = {}) {
    return this._http.get(this.url + '/' + action, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Get a resource
   * @param action The method on the controller
   * @param id resource identifier
   * @param opts http options
   */
  protected getActionById(action: string, id: Identifier, opts = {}) {
    const url = this.url + '/' + action + '/' + id;

    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Get a resource
   * @param action The method on the controller
   * @param date resource identifier / date
   * @param opts http options
   */
  protected getActionByDate(action: string, date: Date, opts = {}) {
    const url = this.url + '/' + action + '/' + to_dd_MMM_YYYY(date);

    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected getActionTimeout(action: string, timeoutMillis: number = 60000, opts = {}) {
    let url = this.url
    if (action)
      url += '/' + action;

    return this._http.get(url, opts ?? {}).pipe(
      map(this.extractData),
      timeout(timeoutMillis),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected post(resource: unknown, opts = {}) {
    return this._http.post(this.url, resource, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Post a resource
   * @param action The method on the controller
   * @param resource The payload
   * @param opts http options
   * @p
   */
  protected postAction(action: string, resource: unknown, opts = {}) {
    let url = this.url
    if (action)
      url += '/' + action;

    return this._http.post(url, resource, opts ?? {})
      .pipe(
        map(this.extractData),
        catchError((error) => this.handleError(error))
      )
  }

  //------------------------------//

  protected postActionTimeout(action: string, resource: any, timeoutMillis: number = 60000, opts = {}) {
    let url = this.url
    if (action)
      url += '/' + action;

    return this._http.post(url, resource, opts ?? {}).pipe(
      map(this.extractData),
      timeout(timeoutMillis),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//


  protected patchById(id: string | number, resource: unknown, opts = {}) {
    const patchUrl = this.url + '/' + id;

    return this._http.patch(patchUrl, resource, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  } //update

  //------------------------------//

  protected patchAction(action: string, resource: unknown, opts = {}) {
    return this._http.patch(this.url + '/' + action, resource, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Patch a resource with the resources property as query param
   * @param action The method on the controller
   * @param id resource identifier
   * @param opts http options
   */
  protected patchActionById(action: string, id: Identifier, opts = {}) {
    const url = this.url + '/' + action + '/' + id;

    return this._http.patch(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  /**
   * Get a resource
   * @param action The method on the controller
   * @param date resource identifier / date
   * @param opts http options
   */
  protected patchActionByDate(action: string, date: Date, opts = {}) {
    const url = this.url + '/' + action + '/' + to_dd_MMM_YYYY(date);

    return this._http.patch(url, opts ?? {}).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected delete(id: string | number, opts = {}): Observable<any> {
    const deleteUrl = this.url + '/' + id;

    return this._http.delete(deleteUrl, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//
  /**
   * Delete a resource
   * @param action The method on the controller
   * @param id resource identifier
   * @param opts http options
   */
  protected deleteAction(action: string, id: Identifier, opts = {}) {

    const deleteUrl = this.url + '/' + action + '/' + id;

    return this._http.delete(deleteUrl, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //------------------------------//

  protected handleError(httpErrorResponse: HttpErrorResponse) {

    if (isDevMode())
      console.log('httpErrorResponse', httpErrorResponse)

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


    //Known error?
    const nonBadRequestHttpError =
      HttpError.getNonBadRequestErrorFromStatusCode(statusCode);

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
    if (nonBadRequestHttpError) return throwError(() => nonBadRequestHttpError);

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

  //------------------------------//

  protected extractData(res: any) {
    return res;
    // return res.text() ? res.json() : {};
  }

} //Cls
