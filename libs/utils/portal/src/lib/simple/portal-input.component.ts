import { Portal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, PLATFORM_ID, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SbPortalBridgeService } from './portal-bridge.service';

@Component({
  selector: 'sb-portal-input',
  standalone: true,
  imports: [PortalModule],
  template: ``,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalInputComponent implements AfterViewInit, OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService);
  private _platformId = inject(PLATFORM_ID)
  private _viewContainerRef = inject(ViewContainerRef);
  private _destroyer = inject(DestroyRef);


  private _portal?: Portal<unknown>

  _portalTemplate = input.required<TemplateRef<unknown>>({ alias: 'portalTemplate' });
  private _portalTemplate$ = toObservable(this._portalTemplate)


  //----------------------------------//

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId))
      return

    //Wait for viewcontainer to be initialized
    this._portalTemplate$
      .pipe(takeUntilDestroyed(this._destroyer))
      .subscribe((template) => {
        if (!template)
          return

        this._portal = new TemplatePortal(template, this._viewContainerRef);
        this._portalBridge.updatePortal(this._portal)
      })
  }


  ngOnDestroy(): void {

    if (!isPlatformBrowser(this._platformId))
      return

    this._portalBridge.updatePortal(undefined)
    if (this._portal?.isAttached)
      this._portal?.detach()
  }


}//Cls