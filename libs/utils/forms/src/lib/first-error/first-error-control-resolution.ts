import { ElementRef, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, NgControl } from '@angular/forms';

//##############################################//

/**
 * Represents a resolved form control with its name and control reference.
 */
export interface ResolvedControl {
  /** The name of the control */
  name: string;
  /** The AbstractControl instance */
  control: AbstractControl;
}

//##############################################//

@Injectable({ providedIn: 'root' })
export class FirstErrorControlResolutionService {

  /**
   * Builds a lookup map from control host element to its `NgControl`.
   *
   * Used by delegated `focusout` handling to resolve controls quickly
   * without scanning all controls on every event.
   */
  buildControlHostMap(ngControls?: readonly NgControl[] | null): Map<HTMLElement, NgControl> {
    const controlHostMap = new Map<HTMLElement, NgControl>();

    if (!ngControls)
      return controlHostMap;

    for (const ngControl of ngControls) {
      const hostElement = this.getHostElementForNgControl(ngControl);
      if (!hostElement || !ngControl.control)
        continue;

      controlHostMap.set(hostElement, ngControl);
    }

    return controlHostMap;
  }

  //- - - - - - - - - - - - - - //

  /**
   * Resolves the DOM host element for a control directive.
   *
   * Tries the control directive host first and then falls back to the
   * value accessor host (useful for some CVA/material integrations).
   */
  private getHostElementForNgControl(ngControl: NgControl): HTMLElement | null {
    const controlHostElement = (ngControl as { _elementRef?: ElementRef<unknown> })._elementRef?.nativeElement;

    if (controlHostElement instanceof HTMLElement)
      return controlHostElement;

    const accessorHostElement = (ngControl.valueAccessor as { _elementRef?: ElementRef<unknown> } | null)?._elementRef?.nativeElement;

    if (!(accessorHostElement instanceof HTMLElement))
      return null;

    return accessorHostElement;
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
   */
  private resolveControlName(ngControl: NgControl | null): string | null {
    if (!ngControl)
      return null;

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
  private findControlNameFromEvent(event: Event): string | null {
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
    form?: FormGroup,
  ): ResolvedControl | null {
    const ngControl = this.findNgControlFromEvent(event, hostElement, controlHostMap);
    if (ngControl?.control) {
      const ngControlName = this.resolveControlName(ngControl) ?? this.findControlNameFromEvent(event);
      if (ngControlName)
        return { name: ngControlName, control: ngControl.control };
    }

    const domControlName = this.findControlNameFromEvent(event);
    if (!domControlName)
      return null;

    const domControl = form?.get(domControlName);
    if (!domControl)
      return null;

    return { name: domControlName, control: domControl };
  }
}
