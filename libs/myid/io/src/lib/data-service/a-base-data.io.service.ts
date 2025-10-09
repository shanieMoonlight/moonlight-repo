import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateUtils } from './date-utils';
import { HttpDeleteOptions, HttpGetOptions, HttpPatchOptions, HttpPostOptions } from './http-options.types';
import { Identifier } from './identifier';
import { HttpError } from './io-errors';
import { MyIdIoLoggerService } from './io-logger';
import { UrlUtils } from './url-utils';

/**
 * Base Service for all http services.
 * Provides basic CRUD operations and error handling. *
 **/
export abstract class ABaseHttpService {

  protected _http = inject(HttpClient);
  private _logger = inject(MyIdIoLoggerService);

  constructor(private url: string) { }

  //----------------------//

  /**
   * Get some resources - Action = 'get'
   * @param opts http options
   */
  protected _get<T>(opts: HttpGetOptions = {}): Observable<T> {
    return this._http.get<T>(this.url, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _getById<T>(
    ids: Identifier | Identifier[],
    opts: HttpGetOptions = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, ...this.idsToArray(ids))
    return this._http.get<T>(url, opts).pipe(
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
  protected _getQueryParams<T>(params: string, opts: HttpGetOptions = {}): Observable<T> {
    return this._http.get<T>(this.url + params, opts).pipe(
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
  protected _getByDate<T>(date: Date, opts: HttpGetOptions = {}): Observable<T> {
    const url = UrlUtils.combine(this.url, DateUtils.toIsoString(date));
    return this._http.get<T>(url, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _getUrl<T>(url: string, opts: HttpGetOptions = {}): Observable<T> {
    return this._http.get<T>(url, opts).pipe(
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
  protected _getAction<T>(action: string, opts: HttpGetOptions = {}): Observable<T> {
    const url = UrlUtils.combine(this.url, action);
    return this._http.get<T>(url, opts).pipe(
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
    opts: HttpGetOptions = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action, ...this.idsToArray(ids));
    return this._http.get<T>(url, opts).pipe(
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
    opts: HttpGetOptions = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action, DateUtils.toIsoString(date));
    return this._http.get<T>(url, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _post<T>(resource: unknown, opts: HttpPostOptions = {}): Observable<T> {
    return this._http.post<T>(this.url, resource, opts).pipe(
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
    opts: HttpPostOptions = {}
  ): Observable<T> {
    const url = UrlUtils.combine(this.url, action);
    return this._http.post<T>(url, resource, opts).pipe(
      map(this.extractData),
      catchError((error) => this.handleError(error))
    );
  }

  //----------------------//

  protected _patch<T>(resource: unknown, opts: HttpPatchOptions = {}): Observable<T> {
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
    opts: HttpPatchOptions = {}
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
    opts: HttpDeleteOptions = {}
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
    opts: HttpDeleteOptions = {}
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

    this._logger.error('handleError - httpErrorResponse', httpErrorResponse);

    // Centralized error mapping (handles all cases, including application error header)
    const customError = HttpError.getErrorFromHttpResponse(httpErrorResponse);
    return throwError(() => customError)
    
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
