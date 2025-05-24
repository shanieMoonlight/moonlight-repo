import { Portal } from '@angular/cdk/portal';
import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SbPortalBridgeService {

  private _portals = signal<Map<string, Portal<unknown>>>(new Map())

  //- - - - - - - - - - - - -//

  /**
   * Get a reactive portal by name
   * @param name Signal containing the portal name
   * @returns Signal that emits the portal or undefined
   */
  getPortal = (name: Signal<string>): Signal<Portal<unknown> | undefined> =>
    computed(() => this._portals().get(name()))


  /**
   * Get all registered portal names (useful for debugging)
   */
  updatePortal(name: string, portal: Portal<unknown>) {

    this._portals.update(portals => {
      const newPortals = new Map(portals) //trigger change detection
      return newPortals.set(name, portal)
    })
  }


  removePortal(name: string) {

    this._portals.update(portals => {
      const newPortals = new Map(portals);
      newPortals.delete(name);
      return newPortals;
    })
  }


}//Cls