import { delay, mergeMap, Observable, of, throwError } from 'rxjs';
import { MessageResponse } from '../../data/message-response';
import { signal } from '@angular/core';


export abstract class BaseDummyIoService<T> {

  protected errorProbability = 0.2; // 20% chance of error by default
  private currentData = signal<T[]>([])

  //----------------------------//

  getAll(): Observable<T[]> {
    console.log('getAll()');

    const count = this.getRandomInt(0, 12)
    const items = this.generateRandomItems(count)
    this.currentData.set(items); // Store the current data
    return this.withChaos(
      of(items),
      'Failed to retrieve items'
    );
  }

  //----------------------------//

  getById(id: string | number): Observable<T | undefined> {
    return this.withChaos(
      of(this.generateRandomItem()),
      `Failed to retrieve item with id ${id}`
    );
  }

  //----------------------------//

  create(item: T): Observable<T> {
    console.log('create()', item);
    return this.withChaos(
      of(item),
      'Failed to create item'
    );
  }

  //----------------------------//

  update(item: T): Observable<T> {
    console.log('update()', item);
    return this.withChaos(
      of(item),
      'Failed to update item'
    );
  }

  //----------------------------//

  delete(id: string | number): Observable<MessageResponse> {
    console.log(`delete(${id})`);
    return this.withChaos(
      of({ message: 'Item successfully deleted' }),
      `Failed to delete item with id ${id}`
    );
  }

  //----------------------------//

  abstract generateRandomItem(): T | undefined
  abstract generateRandomItems(count: number): T[]

  //----------------------------//

  private getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min


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
    const delayMs = Math.random() * 1000 + 1000; // Random delay between 1-2 seconds

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
