import { MonoTypeOperatorFunction, pipe, tap, finalize } from 'rxjs';

export function onTriggerComplete<T>(behavior: (value?: T, error?: any, completed?: boolean) => void): MonoTypeOperatorFunction<T> {
    return tap({
        next: value => behavior(value), // Apply behavior on success
        error: error => behavior(error as T), // Apply behavior on error
        complete: () => behavior(undefined, undefined, true) // Apply behavior on completion
    });
}



/**
* Executes the provided callback after each 'next' or 'error' emission,
* AND ALSO executes the same callback when the observable sequence terminates
* for any reason (complete, error, or unsubscribe).
*
* NOTE: The callback may run multiple times in sequence for certain events
* (e.g., after 'next' AND after 'complete', or after 'error' AND during 'finalize').
* This is suitable for idempotent actions like setting flags or logging.
*
* @param behavior The function to execute after emissions and on termination.
*/

export function executeAfterEmissionAndOnTermination<T>(
    behavior: (value?: T, error?: any, isFinalize?: boolean) => void
): MonoTypeOperatorFunction<T> {
    return pipe(
        tap({
            // Call behavior on successful emission
            next: (value) => behavior(value, undefined, false),
            // Call behavior on error emission
            error: (error) => behavior(undefined, error, false)
            // No 'complete' handler needed here, finalize covers it
        }),
        // Call behavior on any kind of termination (complete, error, unsubscribe)
        finalize(() => behavior(undefined, undefined, true))
    );
}