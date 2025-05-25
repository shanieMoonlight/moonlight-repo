import { Portal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, PLATFORM_ID, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

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

  //- - - - - - - - - - - - -//
  
  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  })
  private _name$ = toObservable(this._name)
  
  _portalTemplate = input.required<TemplateRef<unknown>>({ alias: 'portalTemplate' });
  private _portalTemplate$ = toObservable(this._portalTemplate)
  
  private _portal?: Portal<unknown>

  //-------------------------//
  
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId))
      return

    //Wait for viewcontainer to be initialized
    combineLatest([this._portalTemplate$, this._name$])
      .pipe(takeUntilDestroyed(this._destroyer))
      .subscribe(([template, name]) => {
        if (!template || !name)
          return

        try {
          this._portal = new TemplatePortal(template, this._viewContainerRef);
          this._portalBridge.updatePortal(name, this._portal);
        } catch (error) {
          console.warn('Error updating portal:', error);
        }
      })
  }


  //- - - - - - - - - - - - - - - //


  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId))
      return
    
    try {
      this._portalBridge.removePortal(this._name())
      if (this._portal?.isAttached)
        this._portal.detach()
    } catch (error) {
      console.warn('Error detaching portal:', error);
    }
  }



}//Cls
