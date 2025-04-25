import { Signal, computed, signal } from "@angular/core"
import { toSignal } from "@angular/core/rxjs-interop"
import { BehaviorSubject, finalize, Observable, ReplaySubject, Subject, Subscription, switchMap, tap } from "rxjs"

//=========================================================//

const SPACE_1 = ' \u200B'
const SPACE_2 = '\u200C '

//=========================================================//

export class MiniState<Input, Output> {

    protected _successMsgBs = new Subject<string>()
    protected _successDataBs = new Subject<Output>()
    protected _loadingBs = new BehaviorSubject<boolean>(false)
    protected _errorMsgBs = new Subject<string>()
    protected _errorBs = new Subject<any>()

    data$: Observable<Output>
    data: Signal<Output | undefined>
    private _prevInput = signal<Input | undefined>(undefined)
    protected prevInput = computed(() => this._prevInput())

    successMsg$ = this._successMsgBs.asObservable()
    successMsg = toSignal(this.successMsg$)

    errorMsg$ = this._errorMsgBs.asObservable()
    errorMsg = toSignal(this.errorMsg$)

    error$ = this._errorBs.asObservable()
    error = toSignal(this.error$)

    loading$ = this._loadingBs.asObservable()
    loading = toSignal(this.loading$, { initialValue: false })


    protected _errorFn?: (input: Input, error: any) => void
    protected _errorMsgFn: (error: any) => string =
        error => error?.message ?? error?.msg ?? ''

    protected _onSuccessFn?: (input: Input, output: Output) => void
    protected _successMsgFn?: (input: Input, output: Output) => string
    protected _successDataProcessor?: (input: Input, output: Output, prevInput: Input | undefined, prevOutput: Output | undefined) => Output | undefined =
        (input, output) => output

    protected _triggerFn$: (input: Input) => Observable<Output>
    protected _onTriggerFn?: (t: Input) => void

    protected static space = SPACE_1
    protected _sub?: Subscription

    //-------------------------------------//

    constructor(
        triggerFn$: (input: Input) => Observable<Output>,
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
    }

    //-------------------------------------//

    /** 
     * Create a message based off the request and response data that will be emitted after a successful trigger.
     * Defaults: No message.
     * Useful for scenarios like deleting and updating data
     */
    setSuccessMsgFn(msgFn?: (input: Input, output: Output) => string) {
        this._successMsgFn = msgFn
        return this
    }

    //-------------------------------------//

    /** Any side effects that should happen after a succesful trigger */
    setOnSuccessFn(successFn: (input: Input, output: Output) => void) {
        this._onSuccessFn = successFn
        return this
    }

    //-------------------------------------//

    /** 
     * What to do with the data after a succesful trigger before passing on to client/user.
     * Default: returns unprocessed data
     */
    setSuccessDataProcessorFn(successDataProcessorFn: (input: Input, output: Output, prevInput: Input | undefined, prevOutput: Output | undefined) => Output | undefined) {
        this._successDataProcessor = successDataProcessorFn
        return this
    }

    //-------------------------------------//

    /** 
     * Any extra side effects that should happen after a successful trigger response
     * Any side effects that should happen after a failed trigger response
     */
    setOnErrorFn(errorFn: (input: Input, error: any) => void) {
        this._errorFn = errorFn
        return this
    }

    //-------------------------------------//

    /**
     * How to convert an error resonse to a message that will be emitted.
     * Default: error => error?.message ?? error?.msg ?? ''
     */
    setErrorMsgFn(msgFn: (error: any) => string) {
        this._errorMsgFn = msgFn
        return this
    }

    //-------------------------------------//

    /** 
     * Any extra side effects that should happen after a successful trigger response
     * Default: Do nothing
     */
    setOnTriggerFn(onTriggerFn?: (t: Input) => void) {
        this._onTriggerFn = onTriggerFn
        return this
    }

    //-------------------------------------//

    trigger(input: Input) {

        // console.log('trigger', input);


        this._loadingBs.next(true)

        this._onTriggerFn?.(input)

        this._sub?.unsubscribe?.()

        //Not using finalize in case obs doesn't complete
        this._sub = this._triggerFn$(input)
            .pipe(finalize(() => this._loadingBs.next(false))) //This is for EMPTY
            .subscribe({
                next: data => {

                    // console.log('MiniState', data);
                    // console.log(this._successDataProcessor?.(input, data, this.prevInput(), this.data()) ?? data);
                    // console.log(this._successDataProcessor);


                    this._loadingBs.next(false)
                    this._successDataBs.next(this._successDataProcessor?.(input, data, this.prevInput(), this.data()) ?? data)
                    this.emitSuccessMsg(this._successMsgFn?.(input, data))

                    //In case loading MUST complete first (Maybe for navigation)
                    setTimeout(() => this._onSuccessFn?.(input, data), 500)
                    this._prevInput.set(input)
                },
                error: error => {

                    // console.log('MiniState', error);
                    this._loadingBs.next(false)
                    this.emitErrorMsg(this._errorMsgFn(error))
                    this._errorBs.next(error)

                    //In case loading MUST complete first (Maybe for navigation)
                    setTimeout(() => this._errorFn?.(input, error), 200)
                }
            })

        return this
    }

    //-------------------------------------//

    /** Stop Listening */
    unsubscribe() { this._sub?.unsubscribe?.() }

    //-------------------------------------//

    /**This makes sure all messages are unique. So that popups with @Inputs will be triggered */
    protected getSpace = () => {
        if (!MiniState.space.length)
            return MiniState.space = SPACE_1
        else if (MiniState.space == SPACE_1)
            return MiniState.space = SPACE_2
        else
            return MiniState.space = ''
    }

    //-------------------------------------//

    protected emitErrorMsg(errorMsg?: string) {

        //Add/remove space to make sure all messages are different. (To trigger @Inputs)
        if (errorMsg)
            this._errorMsgBs.next(errorMsg + this.getSpace())
    }

    //-------------------------------------//

    protected emitSuccessMsg(successMsg?: string) {
        //Add/remove space to make sure all messages are different. (To trigger @Inputs)
        if (successMsg)
            this._successMsgBs.next(successMsg + this.getSpace())
    }

    //-------------------------------------//

    /**
     * Set all popup Observables/Signals to default/empty values.
     */
    clearPopups() {
        this._successMsgBs.next('')
        this._errorMsgBs.next('')
        this._loadingBs.next(false)
    }

    //-------------------------------------//

}


