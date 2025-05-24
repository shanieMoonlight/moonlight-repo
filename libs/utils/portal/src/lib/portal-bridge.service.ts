import { Portal } from '@angular/cdk/portal';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SbPortalBridgeService {

  private _portals = signal<Map<string, Portal<unknown>>>(new Map());

  //- - - - - - - - - - - - - - - //

  getPortal = (name: string) =>
    this._portals().get(name)


  getAllPortals = () =>
    this._portals()


  getPortalNames = () => 
    computed(() => Array.from(this._portals().keys()))

  //- - - - - - - - - - - - - - - //

/**
 * Update a portal by name. If portal is undefined, it will remove the portal.
 * @param name 
 * @param portal 
 */
  updatePortal(name: string, portal?: Portal<unknown>) {

    this._portals.update(portals => {
      const newPortals = new Map(portals) //trigger change detection
      if (portal)
        newPortals.set(name, portal)
      else
        newPortals.delete(name)
      return newPortals;
    })

  }

  //- - - - - - - - - - - - - - - //

  // Remove a portal
  removePortal = (name: string) =>
    this.updatePortal(name, undefined);


}