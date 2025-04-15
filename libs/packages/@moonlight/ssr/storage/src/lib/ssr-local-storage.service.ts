import { isPlatformBrowser } from '@angular/common'
import { Injectable, PLATFORM_ID, inject } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class SsrLocalStorageService {
  private _platformId = inject(PLATFORM_ID)

  private isBrowser(): boolean {
    return isPlatformBrowser(this._platformId)
  }

  // -----------------------------//

  get length(): number {
    return this.isBrowser()
      ? localStorage.length
      : 0
  }

  // -----------------------------//

  clear(): void {
    if (this.isBrowser())
      localStorage.clear()
  }

  // -----------------------------//

  getItem(key: string): string | null {
    return this.isBrowser()
      ? localStorage.getItem(key)
      : null
  }

  // -----------------------------//

  getItemObject<T>(key: string): T | null {
    if (!this.isBrowser()) 
      return null
    
    try {
      const item = localStorage.getItem(key)
      return !item ? null : JSON.parse(item) as T
    } catch (error) {
      console.error(`Error parsing item with key "${key}":`, error)
      return null
    }
  }

  // -----------------------------//

  key(index: number): string | null {
    return this.isBrowser()
      ? localStorage.key(index)
      : null
  }

  // -----------------------------//

  removeItem(key: string): void {
    if (this.isBrowser())
      localStorage.removeItem(key)
  }

  // -----------------------------//

  setItem(key: string, value: string): void {

    if (!this.isBrowser())
      return

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item with key "${key}":`, error)
    }

  }

  // -----------------------------//

  setItemObject<T>(key: string, value: T): void {

    if (!this.isBrowser())
      return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting object with key "${key}":`, error)
    }

  }

  // -----------------------------//

}//Cls