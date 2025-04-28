import { delay, mergeMap, Observable, of, throwError } from 'rxjs';
import { MessageResponse } from '../../data/message-response';


export abstract class BaseDummyIoService<T> {

  protected errorProbability = 0.2; // 20% chance of error by default

  //----------------------------//

  getAll = (): Observable<T[]> =>
    this.withChaos(
      of(this._generateRandomItems(0, 12)),
      `Failed to retrieve items\r\nSomething unexpected happened 😱!`
    )

  //----------------------------//

  getById = (id: string | number): Observable<T | undefined> =>
    this.withChaos(
      of(this.generateRandomItem(id)),
      `Failed to retrieve item with id ${id}\r\nSomething unexpected happened 😱!`
    )

  //----------------------------//

  create = (item: T): Observable<T> =>
    this.withChaos(
      of(item),
      'Failed to create item'
    )

  //----------------------------//

  update = (item: T): Observable<T> =>
    this.withChaos(
      of(item),
      'Failed to update item.\r\nSomething unexpected happened 😱!'
    )

  //----------------------------//

  delete = (id: string | number): Observable<MessageResponse> =>
    this.withChaos(
      of({ message: 'Item successfully deleted' }),
      `Failed to delete item with id ${id}.\r\nSomething unexpected happened 😱!`
    )

  //----------------------------//

  abstract generateRandomItem(id: string | number): T | undefined
  abstract generateRandomItems(count: number): T[]

  //----------------------------//

  private getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min

  //----------------------------//

  private _generateRandomItems = (min: number, max: number): T[] => {
    const count = this.getRandomInt(min, max)
    return this.generateRandomItems(count)
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
