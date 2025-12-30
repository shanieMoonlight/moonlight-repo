import { delay, mergeMap, Observable, of, throwError } from 'rxjs';
import { MessageResponse } from '../../data/message-response';
import { Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MainConstants } from '../../config/constants';


export abstract class BaseDummyIoService<T extends { id?: string | number | null }> {

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

    const item = Math.random() < 0.1
      ? undefined
      : this.generateRandomItem(id)

    return this.withChaos(
      of(item),
      `Failed to retrieve item with id ${id}\r\nSomething unexpected happened 😱!`
    )
  }

  //----------------------------//

  create<CreateT extends Omit<T, 'id'>>(createDto: CreateT): Observable<T> {

    const item = this.generateRandomItem() as T; // has generated id
    
    if (!this.isBrowser)
      return of(item)
    
    const { id: _maybeId, ...rest } = createDto as unknown as Record<string, unknown>;
    Object.assign(item, rest as Partial<T>);

    return this.withChaos(
      of(item),
      'Failed to create item'
    );
  }

  //----------------------------//

  update(updateDto: Partial<T>): Observable<T> {

    var item = this.generateRandomItem() as T

    if (!this.isBrowser)
      return of(item)

    Object.assign(item, updateDto)
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

  abstract generateRandomItem(id?: string | number | null, searchTerm?: string): T
  abstract generateRandomItems(count: number, searchTerm?: string): T[]

  //----------------------------//

  protected generateRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min

  //----------------------------//

  private _generateRandomItems(min: number, max: number, searchTerm?: string): T[] {
    const count = this.generateRandomInt(min, max)
    console.log(`Generating ${count} random items with search term: ${searchTerm}`);

    return this.generateRandomItems(count, searchTerm)
  }

  //----------------------------//

  // private _generateRandomItem(): T {
  //   const id = this.getRandomInt(100, 10000)    
  //   return this.generateRandomItem(id)
  // }


  // override generateRandomItem(id: string | number, searchTerm?: string): Album | undefined {
  //   return Math.random() < 0.1
  //     ? undefined
  //     : AlbumUtils.generateRandomAlbum(id, searchTerm)
  // }

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
