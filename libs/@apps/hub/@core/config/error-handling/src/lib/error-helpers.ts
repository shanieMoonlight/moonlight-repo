import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { DeviceHelpers } from "./device-helpers";

//############################//

/**
 * Interface for structured error information
 */
export interface ErrorInfo {
    constructor: unknown;
    statusCode: number | string;
    name: string;
    message: string;
    originalError: string;
    window: string;
    xtraInfo?: unknown;
    browser: string;
    device: string;
    stack?: string;
}

//############################//

/**
 * Helper service for error handling and formatting
 */
@Injectable({
    providedIn: 'root',
})
export class ErrorHelpers {

    private _doc = inject(DOCUMENT);
    private _deviceHelpers = inject(DeviceHelpers);

    //-------------------------// 


    /**
     * Converts an object to a formatted string representation
     * @param obj The object to convert to string
     * @returns A formatted string with property name/value pairs
     */
    private objectToString(obj?: object): string {
        if (!obj) return '';

        let str = '';
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                str += `${prop}::${obj[prop as keyof object]}\r\n`;
            }
        }
        return str;
    }

    /**
     * Creates a structured error information object from an error
     * @param error The error object to process
     * @returns A structured ErrorInfo object with detailed information
     */
    public createErrorInfoObject(error: any): ErrorInfo {
        return {
            constructor: error?.constructor ?? ' ---',
            statusCode: error?.statusCode ?? ' ---',
            name: error?.name ?? ' ---',
            message: error?.message ?? `${error}`,
            originalError: this.objectToString(error?.originalError),
            window: this._doc.location.href,
            xtraInfo: error?.xtraInfo,
            browser: this._deviceHelpers.WhatBrowswer(),
            device: this._deviceHelpers.WhatDevice(),
            stack: error?.stack
        }
    }

}
