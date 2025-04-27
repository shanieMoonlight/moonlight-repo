import { Signal } from "@angular/core";
import { MiniState } from "@spider-baby/mini-state";
import { MsUtility } from "./mini-state-utility";
import { Observable } from "rxjs";

/**
 * A utility class that combines multiple MiniState instances to provide aggregated state information.
 * 
 * MiniStateCombined takes multiple MiniState instances and exposes unified signals and observables
 * for their loading states, error/success messages, and data. This is especially useful for
 * handling multiple related async operations in a UI, such as displaying a single loading indicator
 * or error message for a group of operations.
 * 
 * @example
 * ```typescript
 * // Create individual MiniState instances
 * const getAllState = MiniStateBuilder.Create(() => service.getAll());
 * const updateState = MiniStateBuilder.CreateWithInput((item) => service.update(item));
 * const deleteState = MiniStateBuilder.CreateWithInput((id) => service.delete(id));
 * 
 * // Combine them for unified UI state handling
 * const combinedState = MiniStateCombined.Combine(getAllState, updateState, deleteState);
 * 
 * // Use the combined signals in your template
 * // <loading-spinner *ngIf="combinedState.loading()"></loading-spinner>
 * // <error-message *ngIf="combinedState.errorMsg()">{{ combinedState.errorMsg() }}</error-message>
 * ```
 */
export class MiniStateCombined {

    /** Signal that provides the latest error message from any of the combined states */
    readonly errorMsg: Signal<string | undefined>   
    /** Observable that emits error messages from any of the combined states */
    readonly errorMsg$: Observable<string | undefined>   
    /** Signal that provides the latest error object from any of the combined states */
    readonly error: Signal<any>                     
    /** Observable that emits error objects from any of the combined states */
    readonly error$: Observable<any>                     
    /** Signal that is true if any of the combined states is loading */
    readonly loading: Signal<boolean>               
    /** Observable that emits true if any of the combined states starts loading, false when all are complete */
    readonly loading$: Observable<boolean>               
    /** Signal that provides the latest success message from any of the combined states */
    readonly successMsg: Signal<string | undefined> 
    /** Observable that emits success messages from any of the combined states */
    readonly successMsg$: Observable<string | undefined> 
    /** Signal that provides the latest data from any of the combined states */
    readonly data: Signal<any | undefined> 
    /** Observable that emits data from any of the combined states */
    readonly data$: Observable<any | undefined> 

    //-------------------------//    

    /**
     * Creates a new MiniStateCombined instance.
     * This constructor is private; use the static Combine method instead.
     * 
     * @param miniStates Array of MiniState instances to combine
     */
    private constructor(miniStates: MiniState<any, any>[]) {

        this.loading = MsUtility.combineLoading(...miniStates)
        this.error = MsUtility.combineErrors(...miniStates)
        this.successMsg = MsUtility.combineSuccessMsgs(...miniStates)
        this.errorMsg = MsUtility.combineErrorMsgs(...miniStates)
        this.data = MsUtility.combineData(...miniStates)
        
        this.loading$ = MsUtility.combineLoading$(...miniStates)
        this.error$ = MsUtility.combineErrors$(...miniStates)
        this.successMsg$ = MsUtility.combineSuccessMsgs$(...miniStates)
        this.errorMsg$ = MsUtility.combineErrorMsgs$(...miniStates)
        this.data$ = MsUtility.combineData$(...miniStates)
    }

    //-------------------------//

    /**
     * Combines multiple MiniState instances into a single MiniStateCombined.
     * 
     * @param miniStates MiniState instances to combine
     * @returns A MiniStateCombined instance that aggregates all the provided states
     */
    static Combine = (...miniStates: MiniState<any, any>[]) =>
        new MiniStateCombined(miniStates)

    //- - - - - - - - - - - - -//    

    /**
     * Creates a signal that is true if any of the provided MiniState instances is loading.
     * 
     * @param miniStates MiniState instances to monitor
     * @returns A computed signal that is true while any state is loading
     */
    static CombineLoaders = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineLoading(...miniStates)

    //- - - - - - - - - - - - -//    

    /**
     * Creates a signal that provides the latest error message from any of the provided MiniState instances.
     * 
     * @param miniStates MiniState instances to monitor
     * @returns A signal that emits the most recent error message
     */
    static CombineErrorMsgs = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineErrorMsgs(...miniStates)

    //- - - - - - - - - - - - -//   

    /**
     * Creates a signal that provides the latest success message from any of the provided MiniState instances.
     * 
     * @param miniStates MiniState instances to monitor
     * @returns A signal that emits the most recent success message
     */
    static CombineSuccessMsgs = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineSuccessMsgs(...miniStates)

    //- - - - - - - - - - - - -// 

    /**
     * Creates a signal that provides the latest data from any of the provided MiniState instances.
     * 
     * @param miniStates MiniState instances to monitor
     * @returns A signal that emits the most recent data
     */
    static CombineData = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineData(...miniStates)

    //- - - - - - - - - - - - -//

    /**
     * Creates a signal that provides the latest error object from any of the provided MiniState instances.
     * 
     * @param miniStates MiniState instances to monitor
     * @returns A signal that emits the most recent error object
     */
    static CombineErrors = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineErrors(...miniStates)

    //-------------------------//


}//Cls