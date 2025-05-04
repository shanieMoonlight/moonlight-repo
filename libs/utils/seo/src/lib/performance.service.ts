import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { filter } from 'rxjs/operators';

/**
 * Layout Shift Entry interface for Core Web Vitals tracking
 * Extends PerformanceEntry with properties specific to layout shift measurements
 */
interface LayoutShiftEntry extends PerformanceEntry {
    /** Whether the user had interacted with the page recently before the layout shift */
    hadRecentInput: boolean;
    /** The layout shift score value */
    value: number;
}

/**
 * Service for monitoring Core Web Vitals and other performance metrics
 * that are important for SEO rankings and user experience.
 * 
 * Tracks:
 * - Largest Contentful Paint (LCP): measures loading performance
 * - First Input Delay (FID): measures interactivity
 * - Cumulative Layout Shift (CLS): measures visual stability
 */
@Injectable({
    providedIn: 'root'
})
export class PerformanceService {

    private _platformId = inject(PLATFORM_ID)
    private _router = inject(Router)
    private _config: SeoConfig = inject(SeoConfigService)

    //-----------------------------//

    /**
     * Initializes performance monitoring and sets up route change listeners
     * to reset metrics on navigation
     */
    constructor() {
        if(!this.isBrowser()) return
        
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
     * that affect SEO ranking and user experience
     * 
     * This method sets up performance observers for LCP, FID, and CLS
     * metrics when supported by the browser. The measurements are
     * currently logged to the console but could be connected to
     * analytics services for reporting.
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

    /**
     * Type guard to check if an entry is a PerformanceEventTiming
     * Used to safely access properties specific to timing entries
     * 
     * @param entry - The performance entry to check
     * @returns True if the entry is a PerformanceEventTiming
     */
    private isPerformanceEventTiming = (entry: PerformanceEntry): entry is PerformanceEventTiming =>
        'processingStart' in entry

    //- - - - - - - - - - - - - - -//

    /**
     * Type guard to check if an entry is a LayoutShiftEntry
     * Used to safely access properties specific to layout shift entries
     * 
     * @param entry - The performance entry to check
     * @returns True if the entry is a LayoutShiftEntry
     */
    private isLayoutShiftEntry = (entry: PerformanceEntry): entry is LayoutShiftEntry =>
        'hadRecentInput' in entry && 'value' in entry;

    //- - - - - - - - - - - - - - -//

    /**
     * Checks if the current platform is a browser
     * Performance measurements are only available in browser environments
     * 
     * @returns True if running in a browser context
     */
    private isBrowser = (): boolean =>
        isPlatformBrowser(this._platformId)

}//Cls