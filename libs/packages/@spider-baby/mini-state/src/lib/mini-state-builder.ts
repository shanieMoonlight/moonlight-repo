import { DestroyRef, Signal, inject } from "@angular/core"
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop"
import { Observable } from "rxjs"
import { MiniState } from "./mini-state"

/**
 * Factory class for creating MiniState instances in different scenarios.
 * 
 * MiniStateBuilder provides static methods to create MiniState instances for common use cases:
 * - Simple async operations without inputs
 * - Operations with manually provided inputs
 * - Operations that automatically react to Observable inputs
 * - Operations that automatically react to Signal inputs
 */
export class MiniStateBuilder {

    /**
     * Creates a MiniState for operations that don't require specific input.
     * 
     * This is useful for simple data fetching operations like "get all items" where
     * no parameters are needed.
     * 
     * @template Output - The type of data returned by the async operation
     * @param triggerFn$ - Function that performs the async operation when triggered
     * @param initialOutputValue - Optional initial value for the output data
     * @returns A configured MiniState instance
     * 
     * @example
     * ```typescript
     * const getAllState = MiniStateBuilder.Create(
     *   () => this.userService.getAll()
     * );
     * 
     * // Trigger the operation
     * getAllState.trigger();
     * ```
     */
    static Create<Output>(triggerFn$: () => Observable<Output>, initialOutputValue?: Output) {
        const destroyer = inject(DestroyRef); // Dynamically inject DestroyRef
        const miniState = new MiniState<void, Output>(triggerFn$, destroyer, initialOutputValue)
        return miniState
    }

    //-------------------------------------//

    /**
     * Creates a MiniState for operations that require manually provided input.
     * 
     * This is used when you need to provide specific input values when triggering
     * the operation, such as IDs, search terms, or filter criteria.
     * 
     * @template Input - The type of input required by the trigger function
     * @template Output - The type of data returned by the async operation
     * @param triggerFn$ - Function that performs the async operation when triggered
     * @param initialOutputValue - Optional initial value for the output data
     * @returns A configured MiniState instance
     * 
     * @example
     * ```typescript
     * const getUserState = MiniStateBuilder.CreateWithInput(
     *   (id: number) => this.userService.getById(id)
     * );
     * 
     * // Trigger the operation with a specific input
     * getUserState.trigger(42);
     * ```
     */
    static CreateWithInput<Input, Output>(triggerFn$: (input: Input) => Observable<Output>, initialOutputValue?: Output) {
        const destroyer = inject(DestroyRef); // Dynamically inject DestroyRef
        const miniState = new MiniState<Input, Output>(triggerFn$, destroyer, initialOutputValue)
        return miniState
    }

    //-------------------------------------//

    /**
     * Creates a MiniState that automatically triggers when an Observable emits.
     * 
     * This is ideal for reactive scenarios where the operation should run
     * automatically in response to changes in an Observable stream, such as
     * route parameters, form values, or other reactive data sources.
     * 
     * @template Input - The type of input required by the trigger function
     * @template Output - The type of data returned by the async operation
     * @param input$ - Observable that emits input values
     * @param triggerFn$ - Function that performs the async operation when triggered
     * @param initialOutputValue - Optional initial value for the output data
     * @returns A configured MiniState instance that triggers automatically
     * 
     * @example
     * ```typescript
     * // Create a state that reacts to route parameter changes
     * const userState = MiniStateBuilder.CreateWithObservableInput(
     *   this.route.paramMap.pipe(map(params => params.get('id'))),
     *   (id: string) => this.userService.getById(id),
     *   this.destroyRef
     * );
     * ```
     */
    static CreateWithObservableInput<Input, Output>(
        input$: Observable<Input>,
        triggerFn$: (input: Input) => Observable<Output>,
        initialOutputValue?: Output
    ) {
        const destroyer = inject(DestroyRef); // Dynamically inject DestroyRef
        const miniState = new MiniState<Input, Output>(triggerFn$, destroyer, initialOutputValue);
        input$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe(t => miniState.trigger(t))

        return miniState
    }

    //-------------------------------------//

    /**
     * Creates a MiniState that automatically triggers when a Signal changes.
     * 
     * This is useful for integrating with Angular's Signals, allowing the operation
     * to run automatically when a signal's value changes.
     * 
     * @template Input - The type of input required by the trigger function
     * @template Output - The type of data returned by the async operation
     * @param input$ - Signal that provides input values
     * @param triggerFn$ - Function that performs the async operation when triggered
     * @param initialOutputValue - Optional initial value for the output data
     * @returns A configured MiniState instance that triggers automatically
     * 
     * @example
     * ```typescript
     * // Create a state that reacts to a filter signal
     * const filteredUsersState = MiniStateBuilder.CreateWithSignalInput(
     *   this.filterCriteria,
     *   (criteria: FilterCriteria) => this.userService.search(criteria),
     *   this.destroyRef
     * );
     * ```
     */
    static CreateWithSignalInput<Input, Output>(
        input$: Signal<Input>,
        triggerFn$: (input: Input) => Observable<Output>,
        initialOutputValue?: Output
    ) {
        const destroyer = inject(DestroyRef); // Dynamically inject DestroyRef
        const miniState = new MiniState<Input, Output>(triggerFn$, destroyer, initialOutputValue)
        toObservable(input$)
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe(t => miniState.trigger(t))

        return miniState
    }
}

