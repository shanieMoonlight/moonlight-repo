import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RemoveNullsService<T> {

  remove = (obj: T): T => RemoveNulls(obj, true)

} 


//==============================//


export function RemoveNulls<T>(obj: T, iterate = true): T {

  if (obj === null || obj === undefined)
    return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== null && item !== undefined) // Remove null/undefined items
      .map(item => iterate && typeof item === 'object' ? RemoveNulls(item, iterate) : item) as T;
  }

  // Handle non-objects (primitives)
  if (typeof obj !== 'object')
    return obj;

  const cleaned = structuredClone(obj);

  for (const key in cleaned) {

    if (cleaned[key] === null || cleaned[key] === undefined)
      delete cleaned[key];

    if (cleaned[key] instanceof Object && iterate)
      cleaned[key] = RemoveNulls(cleaned[key], iterate);
  }

  return cleaned

}

//==============================//