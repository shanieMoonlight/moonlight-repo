export const PortalBridgeServiceCode = `// portal-bridge.service.ts
import { Portal } from '@angular/cdk/portal';
import { Injectable, computed, signal } from '@angular/core';
import { DEFAULT_NAME, PortalInfo, PortalMap } from './portal-constants';

@Injectable({
  providedIn: 'root'
})
export class SbPortalBridgeService {

  // Internal signals for managing portals
  private _portals = signal<PortalMap>({});
  private _portalInfos = signal<Record<string, PortalInfo>>({});

  // Public computed signals for reactivity
  portals = computed(() => this._portals());
  portalInfos = computed(() => this._portalInfos());

  /**
   * Register a portal with a given name
   */
  setPortal(name: string, portal: Portal<any> | null): void {
    this._portals.update(portals => ({
      ...portals,
      [name]: portal
    }));

    this._portalInfos.update(infos => ({
      ...infos,
      [name]: {
        name,
        isAttached: portal !== null,
        timestamp: Date.now()
      }
    }));
  }

  /**
   * Get a portal by name
   */
  getPortal(name: string = DEFAULT_NAME): Portal<any> | null {
    return this._portals()[name] || null;
  }

  /**
   * Check if a portal exists and is attached
   */
  hasPortal(name: string = DEFAULT_NAME): boolean {
    const portal = this.getPortal(name);
    return portal !== null;
  }

  /**
   * Remove a portal
   */
  removePortal(name: string): void {
    this._portals.update(portals => {
      const newPortals = { ...portals };
      delete newPortals[name];
      return newPortals;
    });

    this._portalInfos.update(infos => {
      const newInfos = { ...infos };
      delete newInfos[name];
      return newInfos;
    });
  }

  /**
   * Get all portal names
   */
  getPortalNames(): string[] {
    return Object.keys(this._portals());
  }
}`;
