import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics'; 
import { devConsole } from '@spider-baby/dev-console';
import { FirebaseApp, getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilsService {
  
  private _analytics = inject(Analytics);
  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - - -//

  private _app!: FirebaseApp
  public get app(): FirebaseApp {
    return this._app
  }

  public get appName(): string {
    return this._app?.name ?? 'No Firebase App Initialized'
  }

  //-----------------------------//

  constructor() {
    if (!isPlatformBrowser(this._platformId))
      return
    this._app = getApp();
  }

  //-----------------------------//

  logEvent = (event: string, params = {}) =>
    this.executeAnalyticsAction(
      'logEvent', 
      () => logEvent(this._analytics, event, params))

  //- - - - - - - - - - - - - - -//


  logPageView = (pageTitle: string, pagePath: string) =>
    this.executeAnalyticsAction(
      'logPageView', 
      () => logEvent(this._analytics, 'page_view', { page_title: pageTitle, page_path: pagePath }))

  //- - - - - - - - - - - - - - -//

  logButtonClick = (buttonName: string) =>
    this.executeAnalyticsAction(
      'logButtonClick', 
      () => logEvent(this._analytics, 'button_click', { button_name: buttonName }))

  //- - - - - - - - - - - - - - -//

  logConnectionTest = () =>
    this.executeAnalyticsAction(
      'logConnectionTest', 
      () => logEvent(this._analytics, 'firebase_connection_test', { status: 'attempted' }))

  //-----------------------------//

  private executeAnalyticsAction<T>(actionName: string, action: () => T): T | void {

    if (!this.isBrowser())
      return undefined

    try {
      const result = action();
      devConsole.log(`Successfully executed ${actionName}`);
      return result;
    } catch (error) {
      devConsole.error(`Error executing ${actionName}:`, error);
      return undefined;
    }
  }

  //- - - - - - - - - - - - - - -//

  private isBrowser = (): boolean =>
    isPlatformBrowser(this._platformId)

  //-----------------------------//

}//Cls
