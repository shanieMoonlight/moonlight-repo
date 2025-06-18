import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RemoveNullsService<T> {

  remove(obj: T): T {

    for (const key in obj) {
      (obj[key] === null || obj[key] === undefined) && delete obj[key];
    }

    return obj

  } //remove

} //Cls

//=========================================================================//

export function RemoveNulls(obj: any, iterate = true): any {

  for (const key in obj) {
    (obj[key] === null || obj[key] === undefined) && delete obj[key];
   
    if (obj[key] instanceof Object && iterate)
      RemoveNulls(obj[key])
  }

  return obj

} //remove

//=========================================================================//