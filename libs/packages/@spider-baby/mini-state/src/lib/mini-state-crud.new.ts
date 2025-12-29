import { DestroyRef, inject, Signal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MiniStateCombined } from "@spider-baby/mini-state/utils";
import { BehaviorSubject, filter, map, merge, Observable, of, ReplaySubject, scan, shareReplay, Subject } from "rxjs";
import { MiniState, MiniStateDataAndInput } from "./mini-state";

//=========================================================//
type Identifier = {
    id: string | number;
};

type GetAllAction<
    GetFilter,
    Item extends Identifier
> = {
    type: 'getAll';
    payload: MiniStateDataAndInput<GetFilter, Item[]>;
}

type AddAction<
    Item extends Identifier,
    CreateItemDto = Omit<Item, 'id'>
> = {
    type: 'add';
    payload: MiniStateDataAndInput<CreateItemDto, Item>
}


type UpdateAction<
    Item,
    UpdateItemDto extends Partial<Item> & Identifier = Partial<Item> & Identifier,
    UpdateResponse extends Partial<Item> = Partial<Item>
> = {
    type: 'update';
    payload: MiniStateDataAndInput<UpdateItemDto, UpdateResponse>
}

type DeleteAction<
    Item,
    DeleteResponse = any
> = {
    type: 'delete';
    payload: MiniStateDataAndInput<Item, DeleteResponse>
}

type CrudActions<
    Item extends Identifier,
    GetFilter,
    CreateItemDto = Omit<Item, 'id'>,
    UpdateItemDto extends Partial<Item> & Identifier = Partial<Item> & Identifier,
    UpdateResponse extends Partial<Item> = Partial<Item>,
    DeleteResponse = any> =
    | GetAllAction<GetFilter, Item>
    | AddAction<Item, CreateItemDto>
    | UpdateAction<Item, UpdateItemDto, UpdateResponse>
    | DeleteAction<Item, DeleteResponse>


//=========================================================//

/**
 * MiniCrudStateNew — a compact helper for CRUD collections.
 *
 * This class composes several `MiniState` instances (getAll, add, update, delete)
 * and keeps a client-side array in sync as actions complete. It wires combined
 * state observables (errors, messages, loading) and exposes `data` / `input`
 * signals for convenient UI consumption.
 *
 * Templates:
 * - `GetFilter`: input used to fetch the collection
 * - `Item`: collection item type (must include `id`)
 * - `CreateItemDto`, `UpdateItemDto`, `UpdateResponse`, `DeleteResponse`: per-operation types
 *
 * Note: some wiring has been extracted to private helpers (`setupCombinedSubscriptions`,
 * `setupDataPipeline`) to keep the constructor focused and testable.
 */

export class MiniCrudStateNew<
    GetFilter,
    Item extends Identifier,
    CreateItemDto = Omit<Item, 'id'>,
    UpdateItemDto extends Partial<Item> & Identifier = Partial<Item> & Identifier,
    UpdateResponse extends Partial<Item> = Partial<Item>,
    DeleteResponse = any,
    TError = any
> {


    protected _successDataBs = new BehaviorSubject<Item[]>([])
    /** Observable that emits the data returned by the async operation */
    data$: Observable<Item[]> = this._successDataBs.asObservable()
    /** Signal that provides the data returned by the async operation */
    data: Signal<Item[]> = toSignal(this.data$, { initialValue: [] })


    private _inputBs = new ReplaySubject<GetFilter>(1)
    /** Observable that emits the last input that was used in a trigger */
    input$ = this._inputBs.asObservable()
    /** Signal that provides the last input that was used in a trigger */
    input = toSignal(this._inputBs)


    private _successMsgBs = new Subject<string | undefined>()
    /** Observable that emits success messages after successful operations */
    successMsg$ = this._successMsgBs.asObservable()
    /** Signal that provides the latest success message */
    successMsg = toSignal(this.successMsg$)


    private _errorMsgBs = new Subject<string | undefined>()
    /** Observable that emits error messages when operations fail */
    errorMsg$ = this._errorMsgBs.asObservable()
    /** Signal that provides the latest error message */
    errorMsg = toSignal(this.errorMsg$)


    private _errorBs = new Subject<TError>()
    /** Observable that emits error objects when operations fail */
    error$ = this._errorBs.asObservable()
    /** Signal that provides the latest error object */
    error = toSignal(this.error$)


    private _loadingBs = new BehaviorSubject<boolean>(false)
    /** Observable that emits loading state changes (true when loading, false when complete) */
    loading$ = this._loadingBs.asObservable()
    /** Signal that provides the current loading state */
    loading = toSignal(this.loading$, { initialValue: false })

    //-------------------------//

    private _getAllState: MiniState<GetFilter, Item[]>
    private _addState?: MiniState<CreateItemDto, Item>
    private _updateState?: MiniState<UpdateItemDto, UpdateResponse>
    private _deleteState?: MiniState<Item, DeleteResponse>

    /**
     * Creates a new MiniCrudState instance.
     * Use MiniCrudState.Create() factory method instead of calling this constructor directly.
     * 
     * @param triggerFn$ Function to fetch the collection of items
     */
    private constructor(
        destroyer: DestroyRef,
        getAllState: MiniState<GetFilter, Item[]>,
        addState?: MiniState<CreateItemDto, Item>,
        updateState?: MiniState<UpdateItemDto, UpdateResponse>,
        deleteState?: MiniState<Item, DeleteResponse>,
    ) {

        this._getAllState = getAllState.setInitialOutputValue([])
        this._addState = addState
        this._updateState = updateState
        this._deleteState = deleteState

        //Filter in case user did not provide all states. (They might skip add/update/delete)
        const truthyStates = [
            this._getAllState,
            this._addState,
            this._updateState,
            this._deleteState
        ].filter(s => !!s)

        const combinedStates = MiniStateCombined.Combine(...truthyStates)

        this.setupCombinedSubscriptions(destroyer, combinedStates)

        this.setupDataPipeline(destroyer)

        destroyer.onDestroy(() => {
            this.unsubscribe()
        })
    }

    //- - - - - - - - - - - - -//

    /**
     * Creates a new MiniCrudState instance for managing CRUD operations on a collection.
     * 
     * @template Filter - The type of input for filtering/retrieving the collection
     * @template Item - The type of items in the collection
     * @param triggerFn$ - Function to fetch the collection of items
     * @returns A new MiniCrudState instance
     */
    static Create = <
        GetFilter,
        Item extends Identifier,
        CreateItemDto = Omit<Item, 'id'>,
        UpdateItemDto extends Partial<Item> & Identifier = Partial<Item> & Identifier,
        UpdateResponse extends Partial<Item> = Partial<Item>,
        DeleteResponse = any,
        TError = any
    >(
        getAllState: MiniState<GetFilter, Item[]>,
        addState?: MiniState<CreateItemDto, Item>,
        updateState?: MiniState<UpdateItemDto, UpdateResponse>,
        deleteState?: MiniState<Item, DeleteResponse>
    ) => {
        return new MiniCrudStateNew(
            inject(DestroyRef),
            getAllState,
            addState,
            updateState,
            deleteState
        );
    }

    //-------------------------//

    private isDefined<T>(v: T | undefined | null): v is T { return v != null }

    //- - - - - - - - - - - - -//

    /**
     * Wire combined state observables onto this instance.
     *
     * Subscribes `combinedStates` streams (error, errorMsg, successMsg, loading)
     * and forwards values into this instance's subjects/signals. Uses
     * `takeUntilDestroyed` with the provided `destroyer`.
     */
    private setupCombinedSubscriptions(destroyer: DestroyRef, combinedStates: any) {
        this._getAllState.input$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe(input => this._inputBs.next(input))

        combinedStates.error$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe((error: any) => this._errorBs.next(error))

        combinedStates.errorMsg$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe((errorMsg: string | undefined) => this._errorMsgBs.next(errorMsg))

        combinedStates.successMsg$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe((successMsg: string | undefined) => this._successMsgBs.next(successMsg))

        combinedStates.loading$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe((loading: boolean) => this._loadingBs.next(loading))
    }

    //- - - - - - - - - - - - -//

    /**
     * Build and subscribe the merged data pipeline.
     *
     * Constructs per-operation observables (getAll/add/update/delete), filters
     * out absent states, merges them and scans into the maintained `Item[]`.
     */
    private setupDataPipeline(destroyer: DestroyRef) {
        const maybeSources = [
            this._getAllState.dataAndInput$.pipe(map(all => ({ type: 'getAll', payload: all } as GetAllAction<GetFilter, Item>))),
            this._addState?.dataAndInput$?.pipe(map(inputAndData => ({ type: 'add', payload: inputAndData } as AddAction<Item, CreateItemDto>))),
            this._updateState?.dataAndInput$?.pipe(map(inputAndData => ({ type: 'update', payload: inputAndData } as UpdateAction<Item, UpdateItemDto, UpdateResponse>))),
            this._deleteState?.dataAndInput$?.pipe(map(inputAndData => ({ type: 'delete', payload: inputAndData } as DeleteAction<Item, DeleteResponse>))),
        ]

        const sources = maybeSources.filter(v => this.isDefined(v)) as Observable<CrudActions<Item, GetFilter, CreateItemDto, UpdateItemDto, UpdateResponse, DeleteResponse>>[]

        merge(...sources).pipe(
            takeUntilDestroyed(destroyer),
            scan((state: Item[], action: CrudActions<Item, GetFilter, CreateItemDto, UpdateItemDto, UpdateResponse, DeleteResponse>) => {
                if (!action) return state;

                switch (action.type) {
                    case 'getAll':
                        return [...action.payload.output]
                    case 'add':
                        return [action.payload.output, ...state]
                    case 'update':
                        return state.map(a => {
                            if (!this.equals(a, action.payload.input)) return a
                            return { ...a, ...action.payload.input, ...(action.payload.output ?? {}) }
                        })
                    case 'delete':
                        return state.filter(a => this.equals(a, action.payload.input));
                    default:
                        return state;
                }
            }, [] as Item[])
        ).subscribe(data => this._successDataBs.next(data))
    }

    //-------------------------//

    /**
     * Function used to determine if two items are equal.
     * By default, compares the 'id' property of the items.
     */
    private equals: (item1?: Identifier, item2?: Identifier) => boolean =
        ((item1?: Identifier, item2?: Identifier) => item1?.id === item2?.id)

    //-------------------------//

    /**
     * Sets the function used to determine if two items are equal.
     * This is used for finding items to update or delete in the collection.
     * 
     * @param equals Function that compares two items and returns true if they are the same item
     * @returns This MiniCrudState instance for method chaining
     */
    setEqualsFn(equals?: (item1?: Identifier, item2?: Identifier) => boolean) {
        this.equals = equals ?? ((item1?: Identifier, item2?: Identifier) => item1?.id === item2?.id)
        return this
    }

    //-------------------------//

    /**
     * Triggers the add operation with the provided item.
     * 
     * @param input The item to add
     * @returns The internal MiniState for the add operation
     */
    triggerAdd = (input: CreateItemDto) =>
        this._addState?.trigger(input)

    //-------------------------//

    /**
     * Triggers the update operation with the provided item.
     * 
     * @param input The item to update
     * @returns The internal MiniState for the update operation
     */
    triggerUpdate = (input: UpdateItemDto) =>
        this._updateState?.trigger(input)

    //-------------------------//

    /**
     * Triggers the delete operation with the provided item.
     * 
     * @param input The item to delete
     * @returns The internal MiniState for the delete operation
     */
    triggerDelete = (input: Item) =>
        this._deleteState?.trigger(input)

    //-------------------------//

    /**
     * Stops all ongoing operations and cleans up resources.
     * This includes the main state as well as the add, update, and delete states.
     */
    unsubscribe() {
        this._getAllState?.unsubscribe()
        this._addState?.unsubscribe()
        this._deleteState?.unsubscribe()
        this._updateState?.unsubscribe()
    }

    //-------------------------//

    /**
     * Clears all popup messages and resets loading state for all internal states.
     */
    resetMessagesAndLoading() {
        this._getAllState?.resetMessagesAndLoading()
        this._addState?.resetMessagesAndLoading()
        this._updateState?.resetMessagesAndLoading()
        this._deleteState?.resetMessagesAndLoading()
    }

}//Cls
