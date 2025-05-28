import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Platform } from "@angular/cdk/platform";
import { Injectable, inject } from "@angular/core";


@Injectable({
    providedIn: 'root',
})
export class DeviceHelpers {

    private _platform = inject(Platform)
    private _bpObserver = inject(BreakpointObserver)

    //-----------------------------------------//

    public WhatBrowswer(): string {

        if (this._platform.TRIDENT)
            return "Internet Explorer"
        if (this._platform.EDGE)
            return "Edge - Old"
        if (this._platform.FIREFOX)
            return "Firefox"
        if (this._platform.WEBKIT)
            return "Opera"
        if (this._platform.SAFARI)
            return "Safari"
        if (this._platform.BLINK)
            return "Chrome"
        if (this._platform.IOS)
            return "IOS"

        return "Dunno Man"

    }

    //-----------------------------------------//

    public WhatDevice(): string {

        let deviceInfo = ''

        if (this._bpObserver.isMatched(Breakpoints.Handset))
            deviceInfo += ', Handset'
        if (this._bpObserver.isMatched(Breakpoints.HandsetLandscape))
            deviceInfo += ', HandsetLandscape'
        if (this._bpObserver.isMatched(Breakpoints.HandsetPortrait))
            deviceInfo += ', HandsetPortrait'
        if (this._bpObserver.isMatched(Breakpoints.Large))
            deviceInfo += ', Large'
        if (this._bpObserver.isMatched(Breakpoints.Medium))
            deviceInfo += ', Medium'
        if (this._bpObserver.isMatched(Breakpoints.Small))
            deviceInfo += ', Small'
        if (this._bpObserver.isMatched(Breakpoints.Tablet))
            deviceInfo += ', Tablet'
        if (this._bpObserver.isMatched(Breakpoints.TabletLandscape))
            deviceInfo += ', TabletLandscape'
        if (this._bpObserver.isMatched(Breakpoints.TabletPortrait))
            deviceInfo += ', TabletPortrait'
        if (this._bpObserver.isMatched(Breakpoints.Web))
            deviceInfo += ', Web'
        if (this._bpObserver.isMatched(Breakpoints.WebLandscape))
            deviceInfo += ', WebLandscape'
        if (this._bpObserver.isMatched(Breakpoints.WebPortrait))
            deviceInfo += ', WebPortrait'
        if (!deviceInfo)
            deviceInfo = 'Dunno Man'
        
        return deviceInfo

    }

    //-----------------------------------------//

}//Cls
