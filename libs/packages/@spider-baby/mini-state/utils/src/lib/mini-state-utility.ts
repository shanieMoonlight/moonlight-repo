import { Signal, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MiniState } from "@spider-baby/mini-state";
import { combineLatest, distinctUntilChanged, map, merge, Observable, of } from "rxjs";

/**
 * Utility class providing methods to combine and aggregate state from multiple MiniState instances.
 * 
 * MsUtility contains static methods for combining different aspects of MiniState instances,
 * such as loading states, error messages, success messages, and data. These utilities are
 * used internally by MiniStateCombined but can also be used directly for more granular control.
 */
export class MsUtility {

    /**
     * Combines error objects from multiple MiniState instances into a single Observable.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Observable that emits error objects from any of the source MiniStates
     */
    static combineErrors$ = (...miniStates: MiniState<any, any>[]): Observable<any> =>
        merge(...miniStates.map(st => st.error$))

    /**
     * Creates a Signal that provides the latest error object from any of the provided MiniStates.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Signal that provides the most recent error object
     */
    static combineErrors = (...miniStates: MiniState<any, any>[]): Signal<any> =>
        toSignal(this.combineErrors$(...miniStates))

    //- - - - - - - - - - - - -//

    /**
     * Combines error messages from multiple MiniState instances into a single Observable.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Observable that emits error messages from any of the source MiniStates
     */
    static combineErrorMsgs$ = (...miniStates: MiniState<any, any>[]): Observable<string | undefined> =>
        merge(...miniStates.map(st => st.errorMsg$))

    /**
     * Creates a Signal that provides the latest error message from any of the provided MiniStates.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Signal that provides the most recent error message
     */
    static combineErrorMsgs = (...miniStates: MiniState<any, any>[]): Signal<string | undefined> =>
        toSignal(this.combineErrorMsgs$(...miniStates))

    //- - - - - - - - - - - - -//

    /**
     * Combines success messages from multiple MiniState instances into a single Observable.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Observable that emits success messages from any of the source MiniStates
     */
    static combineSuccessMsgs$ = (...miniStates: MiniState<any, any>[]): Observable<string | undefined> =>
        merge(...miniStates.map(st => st.successMsg$))

    /**
     * Creates a Signal that provides the latest success message from any of the provided MiniStates.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Signal that provides the most recent success message
     */
    static combineSuccessMsgs = (...miniStates: MiniState<any, any>[]): Signal<string | undefined> =>
        toSignal(this.combineSuccessMsgs$(...miniStates))

    //- - - - - - - - - - - - -//

    /**
     * Combines loading states from multiple MiniState instances into a single Observable.
     * The resulting Observable emits true if any source MiniState is loading.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Observable<boolean> that emits true if any state is loading, false when all are complete
     */
    static combineLoading$(...miniStates: MiniState<any, any>[]): Observable<boolean> {
        const loadingObservables = miniStates.map(st => st.loading$);

        // Handle the edge case where no states are provided
        if (loadingObservables.length === 0) 
            return of(false)

        return combineLatest(loadingObservables).pipe(
            // Map the array of boolean values to a single boolean: true if any are true
            map((loadings: boolean[]) => loadings.some(loading => loading === true)),
            distinctUntilChanged()
        );
    }
    
    /**
     * Creates a computed Signal that is true if any of the provided MiniStates is loading.
     * 
     * @param miniStates Array of MiniState instances to combine
     * @returns Computed Signal<boolean> that is true if any state is loading
     */
    static combineLoading = (...miniStates: MiniState<any, any>[]) =>
        computed(() => miniStates.map(st => st.loading())
            .reduce((acc, curr) => acc || curr, false)
        )

    //- - - - - - - - - - - - -//

    /**
     * Combines data emitted by multiple MiniState instances into a single Observable.
     * 
     * @template T The expected type of data from the MiniStates
     * @param miniStates Array of MiniState instances to combine
     * @returns Observable that emits data from any of the source MiniStates
     */
    static combineData$ = <T>(...miniStates: MiniState<any, T>[]): Observable<T | undefined> =>
        merge(...miniStates.map(st => st.data$))

    /**
     * Creates a Signal that provides the latest data from any of the provided MiniStates.
     * 
     * @template T The expected type of data from the MiniStates
     * @param miniStates Array of MiniState instances to combine
     * @returns Signal that provides the most recent data
     */
    static combineData = <T>(...miniStates: MiniState<any, T>[]): Signal<T | undefined> =>
        toSignal(this.combineData$(...miniStates))

    //- - - - - - - - - - - - -//


}//Cls