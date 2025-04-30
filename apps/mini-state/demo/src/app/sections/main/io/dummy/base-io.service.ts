import { delay, mergeMap, Observable, of, throwError } from 'rxjs';
import { MessageResponse } from '../../data/message-response';
import { Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MainConstants } from '../../config/constants';


export abstract class BaseDummyIoService<T extends { id?: string | number }> {

  protected errorProbability = MainConstants.API_FAILURE_RATE;

  protected _platformId: object;
  protected isBrowser = false;

  //----------------------------//

  constructor(injector: Injector) {
    this._platformId = injector.get(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(this._platformId);
  }

  //----------------------------//

  getAll(): Observable<T[]> {
    if (!this.isBrowser)
      return of([])

    return this.withChaos(
      of(this._generateRandomItems(0, 12)),
      `Failed to retrieve items\r\nSomething unexpected happened 😱!`
    );
  }

  //----------------------------//

  getAllFiltered(searchTerm?: string): Observable<T[]> {
    if (!this.isBrowser)
      return of([])

    return this.withChaos(
      of(this._generateRandomItems(0, 12, searchTerm)),
      `Failed to retrieve items\r\nSomething unexpected happened 😱!`
    );
  }

  //----------------------------//

  getById(id: string | number): Observable<T | undefined> {
    if (!this.isBrowser)
      return of(undefined)

    return this.withChaos(
      of(this.generateRandomItem(id)),
      `Failed to retrieve item with id ${id}\r\nSomething unexpected happened 😱!`
    )
  }

  //----------------------------//

  create(item: T): Observable<T> {

    if (!this.isBrowser)
      return of(item)

    item.id = this.getRandomInt(1, 1000) // Assign a random id for the demo
    return this.withChaos(
      of(item),
      'Failed to create item'
    );
  }

  //----------------------------//

  update(item: T): Observable<T> {
    if (!this.isBrowser)
      return of(item)

    return this.withChaos(
      of(item),
      'Failed to update item.\r\nSomething unexpected happened 😱!'
    );
  }

  //----------------------------//

  delete(id: string | number): Observable<MessageResponse> {
    const response: MessageResponse = { message: 'Item successfully deleted' }
    if (!this.isBrowser)
      return of(response)

    return this.withChaos(
      of(response),
      `Failed to delete item with id ${id}.\r\nSomething unexpected happened 😱!`
    );
  }

  //----------------------------//

  abstract generateRandomItem(id: string | number, searchTerm?: string): T | undefined
  abstract generateRandomItems(count: number, searchTerm?: string): T[]

  //----------------------------//

  private getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min

  //----------------------------//

  private _generateRandomItems(min: number, max: number, searchTerm?: string): T[] {
    const count = this.getRandomInt(min, max)
    console.log(`Generating ${count} random items with search term: ${searchTerm}`);
    
    return this.generateRandomItems(count, searchTerm)
  }

  //----------------------------//
  /**
   * Wraps an observable with chaos behavior (random errors and delays)
   * @param source The source observable
   * @param errorMsg Custom error message
   * @param customErrorProbability Optional override for error probability
   * @returns Observable that may error randomly
   */
  protected withChaos<R>(
    source: Observable<R>,
    errorMsg = 'Random server error occurred',
    customErrorProbability?: number
  ): Observable<R> {
    const errorProb = customErrorProbability ?? this.errorProbability;
    const delayMs = Math.random() * 2000 + 1000; // Random delay between 1-2 seconds

    return of(null).pipe(
      delay(delayMs),
      mergeMap(() => {
        if (Math.random() < errorProb)
          return throwError(() => new Error(errorMsg))
        else
          return source;
      })
    );
  }



}//Cls
