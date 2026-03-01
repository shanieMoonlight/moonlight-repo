import { Injectable } from "@angular/core";
import { NgControl } from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class ControlNameResolver {

    /**
     * Resolves a control name from an `NgControl` using path first, then name.
     *
     * Rationale: prefer `ngControl.path` because it represents the full location
     * of the control in the form tree; the last segment is the control's local
     * key or FormArray index (e.g. `['aliases', 0]` -> `'0'`). This is more
     * reliable than `ngControl.name` for nested groups, FormArray entries, and
     * some CVA/wrapper scenarios where `name` may be undefined or inconsistent.
     */
    resolveFromNgControl(ngControl: NgControl | null): string | null {
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
    resolveFromElement(targetElement: HTMLElement | null): string | null {
        if (!targetElement)
            return null;

        const controlElement = targetElement.closest('[formControlName]');

        if (!controlElement)
            return null;

        return controlElement.getAttribute('formControlName');
    }

}
