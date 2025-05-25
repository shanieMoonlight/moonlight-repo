export const PortalBridgeServiceCode = `// portal-bridge.service.ts
import { Portal } from '@angular/cdk/portal';
import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SbPortalBridgeService {

  //Use signal so we can react to changes
  private _portals = signal<Map<string, Portal<unknown>>>(new Map())

  //- - - - - - - - - - - - -//

  /**
   * Get a reactive portal by name
   * @param name Signal containing the portal name
   * @returns Signal that emits the portal or undefined
   */
  getPortal = (name: Signal<string>): Signal<Portal<unknown> | undefined> =>
    computed(() => this._portals().get(name())); //Will recalculate when the name or portal map changes

  //- - - - - - - - - - - - -//

  /**
   * Update or register a portal with the given name
   */
  updatePortal(name: string, portal: Portal<unknown>) {
    this._portals.update(portals => {
      const newPortals = new Map(portals) //trigger change detection
      return newPortals.set(name, portal)
    })
  }

  //- - - - - - - - - - - - -//

  /**
   * Remove a portal and detach it if necessary
   */
  removePortal(name: string) {
    
    this._portals.update(portals => {
      const existingPortal = portals.get(name);

      // Detach portal if it's attached
      try {
        if (existingPortal?.isAttached)
          existingPortal.detach();
      } catch (error) {
        console.warn('Error detaching portal:', error);
      }

      const newPortals = new Map(portals);//trigger change detection
      newPortals.delete(name);
      return newPortals;
    })
  }
}`;
