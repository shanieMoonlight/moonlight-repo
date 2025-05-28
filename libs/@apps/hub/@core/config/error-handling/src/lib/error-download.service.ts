import { Injectable, inject } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';
import { FileDownloadService } from '@spider-baby/utils-file-saver';
import { ErrorHelpers } from './error-helpers';

//############################//

/**
 * Interface for error information batch
 */
interface ErrorBatch {
    timestamp: string;
    errorCount: number;
    errors: unknown[];
}

//############################//

/**
 * Service responsible for managing error file downloads
 * Handles buffering, throttling and batching of error downloads
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorDownloadService {
    private _blobHandler = inject(FileDownloadService);
    private _errorHelpers = inject(ErrorHelpers);

    // Error buffering properties
    private _errorBuffer: unknown[] = [];
    private _bufferTimeout: ReturnType<typeof setTimeout> | null = null;
    private readonly _bufferTimeMs = 3000; // 3 seconds to group errors

    // Cooldown properties
    private _lastDownloadTime = 0;
    private readonly _downloadCooldownMs = 10000; // 10 seconds between downloads


    //--------------------------//


    /**
     * Adds an error to the buffer and schedules processing
     * @param error The error to buffer for download
     */
    public bufferErrorForDownload(error: unknown): void {
        // Add error to buffer
        this._errorBuffer.push(error);

        // Clear existing timeout if there is one
        if (this._bufferTimeout)
            clearTimeout(this._bufferTimeout);


        // Set a new timeout to process all errors in buffer
        this._bufferTimeout = setTimeout(() => {
            this.processErrorBuffer();
            this._bufferTimeout = null;
        }, this._bufferTimeMs);
    }


    //--------------------------//

    /**
     * Processes the error buffer, respecting cooldown periods
     * and choosing appropriate download format based on error count
     */
    private processErrorBuffer(): void {
        if (this._errorBuffer.length === 0)
            return;


        const currentTime = Date.now();

        // Check cooldown period
        if (currentTime - this._lastDownloadTime < this._downloadCooldownMs) {
            devConsole.log(`Download cooldown active. Skipping download for ${this._errorBuffer.length} errors.`);
            this._errorBuffer = []; // Clear buffer
            return;
        }

        // Update last download time
        this._lastDownloadTime = currentTime;

        // Single error - use simple format
        if (this._errorBuffer.length === 1)
            this.downloadErrorAsTxtFile(this._errorBuffer[0])
        else // Multiple errors - use batch format
            this.downloadErrorBatchAsTxtFile(this._errorBuffer);


        // Clear the buffer
        this._errorBuffer = [];
    }

    
    //--------------------------//


    /**
     * Downloads a single error as a text file
     * @param error The error to download
     */
    private downloadErrorAsTxtFile(error: unknown): void {
        const errorInfoObject = this._errorHelpers.createErrorInfoObject(error);
        const errorString = JSON.stringify(errorInfoObject, null, 2)
            .replace(new RegExp('\\\\n', 'g'), '\r\n');

        this._blobHandler.downloadText(
            errorString,
            `Error_${this.formatYearMonthDay()}.txt`
        );
    }


    //--------------------------//


    /**
     * Downloads multiple errors as a single batch text file
     * @param errors Array of errors to download
     */
    private downloadErrorBatchAsTxtFile(errors: unknown[]): void {
        // Create a combined error object
        const errorObjects = errors.map(error =>
            this._errorHelpers.createErrorInfoObject(error)
        );

        const batchData: ErrorBatch = {
            timestamp: new Date().toISOString(),
            errorCount: errors.length,
            errors: errorObjects
        };

        const errorString = JSON.stringify(batchData, null, 2)
            .replace(new RegExp('\\\\n', 'g'), '\r\n');

        this._blobHandler.downloadText(
            errorString,
            `Errors_Batch_${this.formatYearMonthDay()}_Count_${errors.length}.txt`
        );
    }


    //--------------------------//


    /**
     * Formats the current date as YYYY-MM-DD for file naming
     * @param date Optional date to format (defaults to now)
     * @param separator Optional separator character (defaults to '-')
     * @returns Formatted date string
     */
    private formatYearMonthDay(date: Date = new Date(), separator = '-'): string {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;

        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join(separator);
    }


}//Cls
