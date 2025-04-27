import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

interface LayoutShiftEntry extends PerformanceEntry {
    hadRecentInput: boolean;
    value: number;
}

@Injectable({
    providedIn: 'root'
})
export class PerformanceService {

    private _platformId = inject(PLATFORM_ID)
    private _router = inject(Router)

    //-----------------------------//

    constructor() {
        // Monitor route changes to track page performance
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            // Reset performance metrics on navigation
            this.measureCoreWebVitals();
        });
    }

    //-----------------------------//

    /**
     * Measures Core Web Vitals and other performance metrics
     * These metrics affect SEO ranking
     */
    measureCoreWebVitals() {
        if(!this.isBrowser()) return

        if (!('performance' in window)) return;

        // Use Performance Observer when available to track LCP, FID, and CLS
        if (!('PerformanceObserver' in window)) return;

        // Largest Contentful Paint
        try {
            new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            // Report LCP to analytics (implementation would depend on analytics provider)
            console.debug('LCP:', lastEntry.startTime);
            }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            console.warn('LCP measurement not supported', e);
        }

        // First Input Delay
        try {
            new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                // Type checking to ensure entry has processingStart property
                if (this.isPerformanceEventTiming(entry)) {
                const delay = entry.processingStart - entry.startTime;
                // Report FID to analytics
                console.debug('FID:', delay);
                }
            });
            }).observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.warn('FID measurement not supported', e);
        }

        // Cumulative Layout Shift
        try {
            let cumulativeLayoutShift = 0;
            new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                // Type checking for layout shift entries
                if (this.isLayoutShiftEntry(entry) && !entry.hadRecentInput) {
                cumulativeLayoutShift += entry.value;
                }
            }
            // Report CLS to analytics
            console.debug('CLS:', cumulativeLayoutShift);
            }).observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            console.warn('CLS measurement not supported', e);
        }
    }

    //-----------------------------//

    // Type guard to check if an entry is a PerformanceEventTiming
    private isPerformanceEventTiming = (entry: PerformanceEntry): entry is PerformanceEventTiming =>
        'processingStart' in entry

    //- - - - - - - - - - - - - - -//

    // Type guard to check if an entry is a LayoutShiftEntry
    private isLayoutShiftEntry = (entry: PerformanceEntry): entry is LayoutShiftEntry =>
        'hadRecentInput' in entry && 'value' in entry;

    //- - - - - - - - - - - - - - -//

    private isBrowser = (): boolean =>
        isPlatformBrowser(this._platformId)

}//Cls