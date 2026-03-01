import { ElementRef, inject, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NgControl } from '@angular/forms';
import { ControlNameResolver } from './control-name-resolver';

//##############################################//

/**
 * Represents a resolved form control with its name and control reference.
 */
export interface ResolvedControlData {
    /** The name of the control */
    name: string;
    /** The AbstractControl instance */
    control: AbstractControl;
}

//##############################################//

export const HOST_MARKER_ATTR = 'data-sb-first-error-host';

//##############################################//


@Injectable()
export class FirstErrorControlResolutionService {

    private _controlNameResolver = inject(ControlNameResolver);


    /** Cache for control -> path lookups to avoid repeated deep traversals. */
    private _pathCache = new WeakMap<AbstractControl, string[]>();
    /** Tracks roots whose control-path cache has been fully precomputed. */
    private _warmedRoots = new WeakSet<AbstractControl>();
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
        formRoot: AbstractControl,
        invalidateCache: boolean = true,
    ): Map<HTMLElement, NgControl> {
        const controlHostMap = new Map<HTMLElement, NgControl>();

        // If requested, clear cached control paths since the underlying
        // control/element lists are being rebuilt.
        if (invalidateCache)
            this.invalidatePathCache();

        this.ensureRootPrecomputed(formRoot);

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
     * 2) DOM `formControlName` lookup fallback
     */
    resolveControlForElement(
        targetElement: HTMLElement | null,
        hostElement: HTMLElement,
        controlHostMap: ReadonlyMap<HTMLElement, NgControl>,
        form: FormGroup,
    ): ResolvedControlData | null {
        if (!targetElement)
            return null;

        if (this.shouldIgnoreNestedFirstErrorHost(targetElement, hostElement))
            return null;

        const ngControl = this.findNgControlFromElement(targetElement, hostElement, controlHostMap);
        if (ngControl?.control) {
            // Try path/name first, then DOM attribute. If none present and a root form
            // was provided, fall back to reference-based path discovery in the form tree.
            const ngControlName = this._controlNameResolver.resolveFromNgControl(ngControl) ?? this._controlNameResolver.resolveFromElement(targetElement);
            if (ngControlName)
                return { name: ngControlName, control: ngControl.control };

            const path = this.findControlPath(form, ngControl.control);
            if (path && path.length > 0) {
                const last = String(path[path.length - 1]);
                const resolved = form.get(path);
                if (resolved)
                    return { name: last, control: resolved };
            }
        }

        const domControlName = this._controlNameResolver.resolveFromElement(targetElement);
        if (!domControlName)
            return null;

        const domControl = form?.get(domControlName);
        if (!domControl)
            return null;

        return { name: domControlName, control: domControl };
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

    //- - - - - - - - - - - - - - //

    /**
     * Finds the path (array of segments) to `target` within the provided `root` FormGroup/FormArray.
     * Returns `null` when the control is not contained in the tree rooted at `root`.
     * Results are cached in a WeakMap keyed by `target` to avoid repeated deep traversals.
     */
    private findControlPath(root: AbstractControl, target: AbstractControl): string[] | null {
        if (root === target)
            return [];

        const cached = this._pathCache.get(target);
        if (cached)
            return [...cached];

        // If this root is already warmed and target is still missing, avoid rebuilding.
        if (this._warmedRoots.has(root))
            return null;

        // Cache may be cold if callers invoke this before host-map rebuild precomputes paths.
        this.ensureRootPrecomputed(root);

        const resolved = this._pathCache.get(target);
        return resolved ? [...resolved] : null;
    }

    //- - - - - - - - - - - - - - //

    private ensureRootPrecomputed(root: AbstractControl): void {
        if (this._warmedRoots.has(root))
            return;

        this.precomputeControlPaths(root);
    }

    //- - - - - - - - - - - - - - //

    /** Precomputes paths for every control in a form tree for O(1) lookup during events. */
    private precomputeControlPaths(root: AbstractControl): void {
        const stack: Array<{ control: AbstractControl; path: string[] }> = [{ control: root, path: [] }];

        while (stack.length) {
            const { control, path } = stack.pop()!;

            this._pathCache.set(control, [...path]);

            if (control instanceof FormGroup) {
                const group = control as FormGroup;
                const controls = group.controls;
                for (const key of Object.keys(controls))
                    stack.push({ control: controls[key], path: [...path, key] });
            } else if (control instanceof FormArray) {
                const arr = control.controls;
                for (let i = 0; i < arr.length; i++)
                    stack.push({ control: arr[i], path: [...path, String(i)] });
            }
        }

        this._warmedRoots.add(root);
    }

    //- - - - - - - - - - - - - - //

    /** Clears the internal path cache. Call if the form structure changes significantly. */
    private invalidatePathCache(): void {
        this._pathCache = new WeakMap<AbstractControl, string[]>();
        this._warmedRoots = new WeakSet<AbstractControl>();
    }
}
