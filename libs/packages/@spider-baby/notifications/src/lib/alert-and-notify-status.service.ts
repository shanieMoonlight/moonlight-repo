import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SbNotificationStatusService {

  private _isLoading = signal(false)
  isLoading = computed(() => this._isLoading())

  setIsLoading(value: boolean | null | undefined) {
    // console.log('Lad, I am Loading', !!value)
    this._isLoading.set(!!value)
  }

  //-------------------------------------//

  private _errorMsg = signal<string | undefined>(undefined)
  errorMsg = computed(() => this._errorMsg())

  setErrorMsg(value: string | null | undefined) {
    // console.log('Lad, here is your ERROR message', value)
    this._errorMsg.set(value ?? undefined)
  }

  //-------------------------------------//

  private _successMsg = signal<string | undefined>(undefined)
  successMsg = computed(() => this._successMsg())

  setSuccessMsg(value: string | null | undefined) {
    // console.log('Lad, here is your SUCCESS message', value)
    this._successMsg.set(value ?? undefined)
  }

  //-------------------------------------//

}
