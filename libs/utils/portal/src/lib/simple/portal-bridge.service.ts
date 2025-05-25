import { Portal } from '@angular/cdk/portal';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SbPortalBridgeService {


  private _portal: WritableSignal<Portal<unknown> | undefined> = signal(undefined)
  portal = computed(() => this._portal())


  updatePortal = (portal?: Portal<unknown>) =>
    this._portal.set(portal)

}