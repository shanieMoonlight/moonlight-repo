import { ElementRef, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NgControl } from '@angular/forms';

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

@Injectable({ providedIn: 'root' })
export class FirstErrorControlResolutionService {

    /** Cache for control -> path lookups to avoid repeated deep traversals. */
    private _pathCache = new WeakMap<AbstractControl, string[]>();
    /** Tracks roots whose control-path cache has been fully precomputed. */
    private _warmedRoots = new WeakSet<AbstractControl>();


    /**
     * Builds a lookup map from control host element to its `NgControl`.
     *
     * Used by delegated `focusout` handling to resolve controls quickly
     * without scanning all controls on every event.
     */
    buildControlHostMap(
        ngControls: readonly NgControl[] ,
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
     * Resolves the control associated with an event.
     *
     * Resolution order:
     * 1) `NgControl` map lookup (preferred)
     * 2) DOM `formControlName` lookup fallback
     */
    resolveControlForEvent(
        event: Event,
        hostElement: HTMLElement,
        controlHostMap: ReadonlyMap<HTMLElement, NgControl>,
        form: FormGroup,
    ): ResolvedControlData | null {
        const ngControl = this.findNgControlFromEvent(event, hostElement, controlHostMap);
        if (ngControl?.control) {
            // Try path/name first, then DOM attribute. If none present and a root form
            // was provided, fall back to reference-based path discovery in the form tree.
            const ngControlName = this.resolveControlName(ngControl) ?? this.resolveControlNameFromEvent(event);
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

        const domControlName = this.resolveControlNameFromEvent(event);
        if (!domControlName)
            return null;

        const domControl = form?.get(domControlName);
        if (!domControl)
            return null;

        return { name: domControlName, control: domControl };
    }

    //- - - - - - - - - - - - - - //

    /**
     * Walks up from the event target to the directive host to find a mapped `NgControl`.
     */
    private findNgControlFromEvent(
        event: Event,
        hostElement: HTMLElement,
        controlHostMap: ReadonlyMap<HTMLElement, NgControl>,
    ): NgControl | null {
        const eventTarget = event.target;

        if (!(eventTarget instanceof HTMLElement))
            return null;

        let current: HTMLElement | null = eventTarget;

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
     * Resolves a control name from an `NgControl` using path first, then name.
     *
     * Rationale: prefer `ngControl.path` because it represents the full location
     * of the control in the form tree; the last segment is the control's local
     * key or FormArray index (e.g. `['aliases', 0]` -> `'0'`). This is more
     * reliable than `ngControl.name` for nested groups, FormArray entries, and
     * some CVA/wrapper scenarios where `name` may be undefined or inconsistent.
     */
    private resolveControlName(ngControl: NgControl | null): string | null {
        if (!ngControl)
            return null;


        // Try path-based resolution first for better support of nested controls and FormArrays.
        // ngControl.path is an array representing where the control sits in the form tree
        // The last segment of the path is the name of this specific control (e.g. "aliases.0" -> "0").
        const path = ngControl.path;
        if (path && path.length > 0)
            return String(path[path.length - 1]);

        if (ngControl.name !== null && ngControl.name !== undefined)
            return String(ngControl.name);

        return null;
    }

    //- - - - - - - - - - - - - - //

    /**
     * Resolves `formControlName` from the nearest matching DOM ancestor.
     */
    private resolveControlNameFromEvent(event: Event): string | null {
        const eventTarget = event.target;

        if (!(eventTarget instanceof HTMLElement))
            return null;

        const controlElement = eventTarget.closest('[formControlName]');

        if (!controlElement)
            return null;

        return controlElement.getAttribute('formControlName');
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
