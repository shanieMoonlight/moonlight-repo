import { DestroyRef, Signal } from "@angular/core"
import { toSignal } from "@angular/core/rxjs-interop"
import { devConsole } from "@spider-baby/dev-console"
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription } from "rxjs"
import { executeAfterEmissionAndOnTermination } from "./utils/rxjs-utils"

//=========================================================//

const SPACE_1 = ' \u200B'
const SPACE_2 = '\u200C '

//=========================================================//

/**
 * Core class for managing the state of an asynchronous operation.
 * 
 * MiniState encapsulates the essential states associated with async operations:
 * - Data (the result of the operation)
 * - Loading state (whether the operation is in progress)
 * - Error state (any errors that occurred during the operation)
 * - Success/error messages (user-friendly feedback messages)
 * 
 * It exposes these states as both RxJS Observables and Angular Signals.
 * 
 * @template Input - The type of input required by the trigger function
 * @template Output - The type of data returned by the async operation
 * @template TError - The type of error that might be thrown by the async operation
 */
export class MiniState<Input, Output, TError = any> {

    protected _successMsgBs = new Subject<string | undefined>()
    protected _successDataBs = new Subject<Output>()
    protected _loadingBs = new BehaviorSubject<boolean>(false)
    protected _errorMsgBs = new Subject<string | undefined>()
    protected _errorBs = new Subject<TError>()

    /** Observable that emits the data returned by the async operation */
    data$: Observable<Output>
    /** Signal that provides the data returned by the async operation */
    data: Signal<Output | undefined>

    private _prevInputBs = new BehaviorSubject<Input | undefined>(undefined)
    prevInput = toSignal(this._prevInputBs)

    private _wasTriggeredBs = new BehaviorSubject<boolean>(false);
    /**
     * Observable that emits true after the first trigger
     * Starts with false, then switches to true after the first emission from _prevInputBs
     */
    wasTriggered$ = this._wasTriggeredBs.asObservable();
    /** Signal that indicates whether a trigger has successfully completed at least once */
    wasTriggered = toSignal(this.wasTriggered$, { initialValue: false })
    /** Signal that provides the last input that was used in a successful trigger */

    /** Observable that emits success messages after successful operations */
    successMsg$ = this._successMsgBs.asObservable()
    /** Signal that provides the latest success message */
    successMsg = toSignal(this.successMsg$)

    /** Observable that emits error messages when operations fail */
    errorMsg$ = this._errorMsgBs.asObservable()
    /** Signal that provides the latest error message */
    errorMsg = toSignal(this.errorMsg$)

    /** Observable that emits error objects when operations fail */
    error$ = this._errorBs.asObservable()
    /** Signal that provides the latest error object */
    error = toSignal(this.error$)

    /** Observable that emits loading state changes (true when loading, false when complete) */
    loading$ = this._loadingBs.asObservable()
    /** Signal that provides the current loading state */
    loading = toSignal(this.loading$, { initialValue: false })


    protected _errorFn?: (input: Input, error: TError) => void
    /**
     * Function that converts error objects to user-friendly error messages
     * Default implementation extracts message or msg property from error object
     */
    protected _errorMsgFn: (error: TError) => string = error => {
        const err = error as any; // Still need this casting internally
        return err?.message ?? err?.msg ?? '';
    }

    /** Function to call after a successful operation completes */
    protected _onSuccessFn?: (input: Input, output: Output) => void
    /** Function that generates success messages from input and output data */
    protected _successMsgFn?: (input: Input, output: Output) => string
    /**
     * Function that processes the raw output data before storing it
     * Can be used to transform, combine with previous data, or filter the results
     */
    protected _successDataProcessor?: (input: Input, output: Output, prevInput: Input | undefined, prevOutput: Output | undefined) => Output | undefined =
        (input, output) => output

    /** Function that performs the async operation when triggered */
    protected _triggerFn$: (input: Input) => Observable<Output>
    /** Optional function to call when trigger is initiated (before async operation starts) */
    protected _onTriggerFn?: (t: Input) => void

    private _instanceSpace = SPACE_1
    /** Subscription for the current trigger operation */
    protected _sub?: Subscription

    //-------------------------------------//

    /**
     * Creates a new MiniState instance
     * 
     * @param triggerFn$ Function that performs the async operation when triggered
     * @param initialOutputValue Optional initial value for the output data
     */
    constructor(
        triggerFn$: (input: Input) => Observable<Output>,
        destroyer: DestroyRef,
        initialOutputValue?: Output
    ) {

        if (initialOutputValue) {
            this._successDataBs = new BehaviorSubject<Output>(initialOutputValue)
            this.data$ = this._successDataBs.asObservable()
            this.data = toSignal(this.data$, { initialValue: initialOutputValue })
        } else {
            this._successDataBs = new ReplaySubject<Output>(1)
            this.data$ = this._successDataBs.asObservable()
            this.data = toSignal(this.data$)
        }

        this._triggerFn$ = triggerFn$

        destroyer.onDestroy(() => {
            this.unsubscribe()
        })
    }

    //-------------------------------------//

    /** 
     * Sets a function to generate success messages after successful operations
     * 
     * @param msgFn Function that generates success messages from input and output data
     * @returns This MiniState instance for method chaining
     */
    setSuccessMsgFn(msgFn?: (input: Input, output: Output) => string) {
        this._successMsgFn = msgFn
        return this
    }

    //-------------------------------------//

    /** 
     * Sets a function to be called after a successful operation completes
     * 
     * @param successFn Function to call after successful completion
     * @returns This MiniState instance for method chaining
     */
    setOnSuccessFn(successFn: (input: Input, output: Output) => void) {
        this._onSuccessFn = successFn
        return this
    }

    //-------------------------------------//

    /** 
     * Sets a function to process the output data before it's stored
     * 
     * This can be used to transform the data, combine it with previous data,
     * filter it, or perform any other operation before it's exposed through
     * the data$ observable and data signal.
     * 
     * @param successDataProcessorFn Function that processes output data
     * @returns This MiniState instance for method chaining
     */
    setSuccessDataProcessorFn(successDataProcessorFn: (input: Input, output: Output, prevInput: Input | undefined, prevOutput: Output | undefined) => Output | undefined) {
        this._successDataProcessor = successDataProcessorFn
        return this
    }

    //-------------------------------------//

    /** 
     * Sets a function to be called when an operation fails
     * 
     * @param errorFn Function to call when an error occurs
     * @returns This MiniState instance for method chaining
     */
    setOnErrorFn(errorFn: (input: Input, error: TError) => void) {
        this._errorFn = errorFn
        return this
    }

    //-------------------------------------//

    /**
     * Sets a function to convert error objects to user-friendly messages
     * 
     * @param msgFn Function that converts errors to messages
     * @returns This MiniState instance for method chaining
     */
    setErrorMsgFn(msgFn: (error: TError) => string) {
        this._errorMsgFn = msgFn
        return this
    }

    //-------------------------------------//

    /** 
     * Sets a function to be called when a trigger is initiated
     * 
     * This is called before the async operation begins and can be used
     * for setup or validation.
     * 
     * @param onTriggerFn Function to call when trigger is initiated
     * @returns This MiniState instance for method chaining
     */
    setOnTriggerFn(onTriggerFn?: (t: Input) => void) {
        this._onTriggerFn = onTriggerFn
        return this
    }

    //-------------------------------------//

    /**
     * Triggers the async operation with the provided input
     * 
     * This initiates the operation, manages loading states, and
     * handles success/error outcomes.
     * 
     * @param input The input to pass to the trigger function
     * @returns This MiniState instance for method chaining
     */
    trigger(input: Input) {

        devConsole.log('trigger', input);
        this._loadingBs.next(true)
        this._errorMsgBs.next(undefined); // Clear previous error message
        this._successMsgBs.next(undefined); // Clear previous success message

        this._onTriggerFn?.(input)
        this._sub?.unsubscribe?.()

        //Not using finalize in case obs doesn't complete
        this._sub = this._triggerFn$(input)
            .pipe(
                executeAfterEmissionAndOnTermination((outputValue, error, isFinalized) => 
                    this.handleTriggerComplete(input, outputValue, error, isFinalized)),
            )
            .subscribe({
                next: data => this.handleTriggerSuccess(input, data),
                error: error => this.handleTriggerError(input, error),
            })

        return this
    }

    //-------------------------------------//

    private handleTriggerComplete(input: Input, data?: Output, error?: any, isFinalize?: boolean) {

        this._loadingBs.next(false); //Close the loader
        this._wasTriggeredBs.next(true); // Mark as triggered
        devConsole.log('MiniState: Triggered with input:', input, 'and output:', data, 'and error:', error, 'isFinalize:', isFinalize);

    }

    //- - - - - - - - - - - - - - - - - - -//

    private handleTriggerSuccess(input: Input, data: Output) {

        devConsole.log('MiniState', data);
        devConsole.log(this._successDataProcessor?.(input, data, this.prevInput(), this.data()) ?? data);
        devConsole.log(this._successDataProcessor)

        this._successDataBs.next(this._successDataProcessor?.(input, data, this.prevInput(), this.data()) ?? data)
        this.emitSuccessMsg(this._successMsgFn?.(input, data))

        //In case loaders and popup messages MUST complete first 
        // (Maybe if _onSuccessFn is for navigation away from page)
        setTimeout(() => this._onSuccessFn?.(input, data), 500)
        this._prevInputBs.next(input)
    }

    //- - - - - - - - - - - - - - - - - - -//

    private handleTriggerError(input: Input, error: any) {

        devConsole.log('MiniState', error);
        this.emitErrorMsg(this._errorMsgFn(error))
        this._errorBs.next(error)

        //In case loading MUST complete first
        // (Maybe if _errorFn is for navigation away from page)
        setTimeout(() => this._errorFn?.(input, error), 200)
    }

    //-------------------------------------//

    /**
     * Re-triggers the operation using the most recent input value
     * 
     * This is useful for refreshing data without needing to track
     * the last input value outside of MiniState.
     * 
     * @returns This MiniState instance for method chaining
     */
    retrigger(): this {
        if (this.wasTriggered())
            this.trigger(this.prevInput() as Input);
        else
            console.warn('MiniState: retrigger called before any successful trigger.');

        return this;
    }

    //-------------------------------------//

    /** 
     * Stops all ongoing operations and cleans up resources
     * 
     * This should be called when the MiniState is no longer needed
     * to prevent memory leaks.
     */
    unsubscribe() {

        this._sub?.unsubscribe?.()

        // Complete all subjects
        this._successMsgBs.complete();
        this._successDataBs.complete();
        this._loadingBs.complete();
        this._errorMsgBs.complete();
        this._errorBs.complete();

        // Clear any references that might prevent garbage collection
        this._errorFn = undefined;
        this._onSuccessFn = undefined;
        this._successMsgFn = undefined;
        this._successDataProcessor = undefined;
        this._onTriggerFn = undefined;

        devConsole.log('MiniState unsubscribed');

    }

    //-------------------------------------//

    /**
     * Emits an error message through the errorMsg$ observable
     * 
     * @param errorMsg The error message to emit
     */
    protected emitErrorMsg = (errorMsg?: string) =>
        errorMsg && this._errorMsgBs.next(errorMsg + this.getSpace())

    //-------------------------------------//

    /**
     * Emits a success message through the successMsg$ observable
     * 
     * @param successMsg The success message to emit
     */
    protected emitSuccessMsg = (successMsg?: string) =>
        successMsg && this._successMsgBs.next(successMsg + this.getSpace())

    //-------------------------------------//

    /**
     * Ensures each emitted message is unique by appending a space character
     * 
     * This is needed to trigger Angular @Input setters even when the message
     * content is identical to the previous message.
     * 
     * @returns A space character that alternates between variations
     */
    protected getSpace = () => {
        if (!this._instanceSpace.length)
            return this._instanceSpace = SPACE_1
        else if (this._instanceSpace == SPACE_1)
            return this._instanceSpace = SPACE_2
        else
            return this._instanceSpace = ''
    }

    //-------------------------------------//

    /**
     * Clears all popup messages and resets loading state
     * 
     * This can be used to manually reset the UI state when needed.
     */
    resetMessagesAndLoading() {
        this._successMsgBs.next(undefined)
        this._errorMsgBs.next(undefined)
        this._loadingBs.next(false)
    }

}


