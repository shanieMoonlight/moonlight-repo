import { CdkPortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, WritableSignal, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SbPortalBridgeService {

  private _portalTemplate: WritableSignal<TemplateRef<unknown> | undefined> = signal(undefined)
  template = computed(() => this._portalTemplate())

  private _cdkPortal: WritableSignal<CdkPortal | undefined> = signal(undefined)
  cdkPortal = computed(() => this._cdkPortal())

    
  setPortal = (cdkPortal?: CdkPortal) =>
  this._cdkPortal.set(cdkPortal)

}
