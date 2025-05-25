export const PortalInputComponentCode = `// portal-input.component.ts
import { Portal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { 
  AfterViewInit, 
  ChangeDetectionStrategy, 
  Component, 
  DestroyRef, 
  PLATFORM_ID, 
  TemplateRef,
  ViewContainerRef,
  inject, 
  input
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, finalize } from 'rxjs';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

@Component({
  selector: 'sb-portal-input',
  standalone: true,
  imports: [PortalModule],
  template: \`\`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalInputComponent implements AfterViewInit {

  //Used to bridge portal data between input and output components
  private _portalBridge = inject(SbPortalBridgeService);
  // Used for SSR detection
  private _platformId = inject(PLATFORM_ID)
  //Used to create the TemplatePortal
  private _viewContainerRef = inject(ViewContainerRef);
  //Used to destroy the component and clean up subscriptions
  private _destroyer = inject(DestroyRef);

  //- - - - - - - - - - - - -//

  //Get the portal name from input or use default
  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  })
  // Create an observable to react to changes. We can't start listing immedeately becase the viewContainerRef is not initialized yet
  private _name$ = toObservable(this._name)

  //Get the content to render
  _portalTemplate = input.required<TemplateRef<unknown>>({ alias: 'portalTemplate' });
  // Create an observable to react to changes. We can't start listing immedeately becase the viewContainerRef is not initialized yet
  private _portalTemplate$ = toObservable(this._portalTemplate)

  //The portal instance that will be created and destroyed
  //This wil be sent to the portal bridge service and from there to the portal outlet
  private _portal?: Portal<unknown>

  //-------------------------//

  //Wait for viewcontainer to be initialized
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId))
      return

    //Listen for changes to the template and name inputs
    combineLatest([this._portalTemplate$, this._name$])
      .pipe(
        takeUntilDestroyed(this._destroyer),
        finalize(() => this._portalBridge.removePortal(this._name()))
      )
      .subscribe(([template, name]) => {
        if (!template || !name) //Just in case ;)
          return

        try {
        //Create the portal with the template and viewContainerRef
          this._portal = new TemplatePortal(template, this._viewContainerRef);
          //Pass the portal to the bridge service
          this._portalBridge.updatePortal(name, this._portal);
        } catch (error) {
          console.warn('Error updating portal:', error);
        }
      })
  }
}`;
