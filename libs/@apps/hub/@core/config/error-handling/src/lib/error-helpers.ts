import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { DeviceHelpers } from "./device-helpers";

@Injectable({
    providedIn: 'root',
  })
export class ErrorHelpers {

    private _doc = inject(DOCUMENT)
    private _deviceHelpers = inject(DeviceHelpers)

    //-------------------------------------------// 

    private objToString(obj: object) {
      
        let str = '';
        for (const p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str += `${p}'::'${obj[p as keyof object]}'\r\n'`;
            }
        }
        return str;
    }

    //-------------------------------------------// 

    public CreateErrorInfoObject(error: any) {        
        return {
            constructor: error?.constructor ?? ' ---',
            statusCode: error?.statusCode ?? ' ---',
            name: error?.name ?? ' ---',
            message: error.message ?? `${error}`,
            originalError: this.objToString(error?.originalError),
            window: this._doc.location.href,
            xtraInfo: error.xtraInfo,
            browser: this._deviceHelpers.WhatBrowswer(),
            device: this._deviceHelpers.WhatDevice(),
            stack:error.stack
        }
    }
   

}//Cls
