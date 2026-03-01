import { ElementRef, Injectable } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

//##############################################//

export const HOST_MARKER_ATTR = 'data-sb-first-error-host';

//##############################################//


@Injectable()
export class FirstErrorControlResolutionService {
    /** Marker attribute applied by FirstErrorDirective to its host element. */
    private static readonly FIRST_ERROR_HOST_ATTR = `[${HOST_MARKER_ATTR}]`;


    /**
     * Builds a lookup map from control host element to its `NgControl`.
     *
     * Used by delegated `focusout` handling to resolve controls quickly
     * without scanning all controls on every event.
     */
    buildControlHostMap(
        ngControls: readonly NgControl[],
        ngControlElements: readonly ElementRef<unknown>[],
    ): Map<HTMLElement, NgControl> {
        const controlHostMap = new Map<HTMLElement, NgControl>();

        const length = Math.min(ngControls.length, ngControlElements.length)

        for (let i = 0; i < length; i++) {
            const ngControl = ngControls[i]
            const hostElement = ngControlElements[i]?.nativeElement

            if (!(hostElement instanceof HTMLElement) || !ngControl.control)
                continue;

            controlHostMap.set(hostElement, ngControl);
        }

        return controlHostMap;
    }

    //- - - - - - - - - - - - - - //

    /**
     * Resolves the control associated with a target element.
     *
     * Resolution order:
     * 1) `NgControl` map lookup (preferred)
     */
    resolveControlForElement(
        targetElement: HTMLElement | null,
        hostElement: HTMLElement,
        controlHostMap: ReadonlyMap<HTMLElement, NgControl>,
    ): AbstractControl | null {
        if (!targetElement)
            return null;

        if (this.shouldIgnoreNestedFirstErrorHost(targetElement, hostElement))
            return null;

        const ngControl = this.findNgControlFromElement(targetElement, hostElement, controlHostMap);
        if (!ngControl?.control)
            return null;

        return  ngControl.control
    }

    //- - - - - - - - - - - - - - //

    private shouldIgnoreNestedFirstErrorHost(targetElement: HTMLElement, hostElement: HTMLElement): boolean {
        const nearestFirstErrorHost = targetElement.closest(FirstErrorControlResolutionService.FIRST_ERROR_HOST_ATTR);
        return !!nearestFirstErrorHost && nearestFirstErrorHost !== hostElement;
    }

    //- - - - - - - - - - - - - - //

    /**
     * Walks up from the target element to the directive host to find a mapped `NgControl`.
     */
    private findNgControlFromElement(
        targetElement: HTMLElement,
        hostElement: HTMLElement,
        controlHostMap: ReadonlyMap<HTMLElement, NgControl>,
    ): NgControl | null {
        let current: HTMLElement | null = targetElement;

        //Keep walking up (moving outwards) the DOM tree till we find a host element that we have a mapping for in our controlHostMap. 
        while (current) {
            const mappedNgControl = controlHostMap.get(current);
            if (mappedNgControl)
                return mappedNgControl;

            if (current === hostElement)
                break;

            current = current.parentElement;
        }

        return null;
    }

}
