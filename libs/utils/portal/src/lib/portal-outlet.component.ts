import { PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'sb-portal-outlet',
  standalone: true,
  imports: [PortalModule],
  template: `
  @if(prtl(); as portal){
    <ng-template [cdkPortalOutlet]="portal"/>{{count}}
  }
  `,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalOutletComponent {

  protected _bridge = inject(SbPortalBridgeService)

  private static _count = 1
  count = SbPortalOutletComponent._count++


  //- - - - - - - - - - - - -//

  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  })
  _name$ = toObservable(this._name);

  // protected _portal = this._bridge.getPortal(this._name)
  protected _portal = computed(() => this._bridge.allPortals().get(this._name()))
  protected prtl$ = combineLatest([this._name$, this._bridge.portals$])
    .pipe(takeUntilDestroyed(),
      map(([name, portals]) => {
        const portal = portals.get(name);
        console.log('Portals combineLatest:', SbPortalOutletComponent._count, name, portals.size);
        console.log('Portals combineLatest:', SbPortalOutletComponent._count, portal);
        return portal;
      }))
      prtl = toSignal(this.prtl$, { initialValue: undefined });





  /**
   *
   */
  constructor() {
    console.log('SbPortalOutletComponent initialized with name:', this._name());

    // this._bridge.portals$
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(portals => {
    //     const portal = portals.get(this._name());
    //     console.log('Portals updated:', SbPortalOutletComponent._count, portals);
    //   });


  }

}
