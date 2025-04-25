import { Observable } from "rxjs"
import { MiniState } from "./mini-state"
import { MiniStateBuilder } from "./mini-state-builder"

//=========================================================//

export class MiniCrudState<Filter, Item> extends MiniState<Filter, Item[]> {

    private _addState?: MiniState<Item, Item | undefined>
    private _updateState?: MiniState<Item, Item | undefined>
    private _deleteState?: MiniState<Item, any>

    private equals: (item1?: Item, item2?: Item) => boolean =
        ((item1?: Item, item2?: Item) => (item1 as any)?.id === (item2 as any)?.id)

    //-------------------------------------//

    /**
     * @param triggerFn$ Trigger fetch new data
     */
    private constructor(triggerFn$: (input: Filter) => Observable<Item[]>) {
        super(triggerFn$, [])
        console.log('ctor')
    }

    //-------------------------------------//

    static Create = <Filter, Item>(triggerFn$: (input: Filter) => Observable<Item[]>) =>
        new MiniCrudState<Filter, Item>(triggerFn$)

    //-------------------------------------//

    /**
     * @param equals How to compare 2 items. Used when updating the data array
     */
    setEqualsFn(equals?: (item1?: Item, item2?: Item) => boolean) {
        this.equals = equals ?? ((item1?: Item, item2?: Item) => (item1 as any)?.id === (item2 as any)?.id)
        return this
    }

    //-------------------------------------//

    setAddState(
        triggerFn$: (input: Item) => Observable<Item | undefined>,
        successMsgFn?: (input: Item, output: Item | undefined) => string,
        onTriggerFn?: (input: Item) => void) {

        this._addState = MiniStateBuilder.CreateWithInput(triggerFn$)

        this.setMiniStateOnTriggerFn(this._addState, onTriggerFn)

        this.setMiniStateErrorMsg(this._addState)

        this.setMiniStateOnSuccessFn(
            this._addState,
            (input, output, data) => [...data, output ?? input],
            successMsgFn
        )

        return this
    }

    //-------------------------------------//

    setUpdateState(
        triggerFn$: (input: Item) => Observable<Item | undefined>,
        successMsgFn?: (input: Item, output: Item | undefined) => string,
        onTriggerFn?: (input: Item) => void) {

        this._updateState = MiniStateBuilder.CreateWithInput(triggerFn$)

        this.setMiniStateOnTriggerFn(this._updateState, onTriggerFn)

        this.setMiniStateErrorMsg(this._updateState)

        this.setMiniStateOnSuccessFn(
            this._updateState,
            (input, output, data) => data.map(item =>
                this.equals(item, input) ? { ...item, ...(output ?? input) } : item
            ),
            successMsgFn
        )

        return this
    }

    //-------------------------------------//

    setDeleteState<DeleteResult>(
        triggerFn$: (input: Item) => Observable<DeleteResult | undefined>,
        successMsgFn: (input: Item, output: DeleteResult | undefined) => string,
        onTriggerFn?: (input: Item) => void) {

        this._deleteState = MiniStateBuilder.CreateWithInput(triggerFn$)

        this.setMiniStateOnTriggerFn(this._deleteState, onTriggerFn)

        this.setMiniStateErrorMsg(this._deleteState)

        this.setMiniStateOnSuccessFn(
            this._deleteState,
            (input, output, data) => data.filter(item => !this.equals(item, input)),
            successMsgFn
        )

        return this
    }

    //-------------------------------------//

    triggerAdd = (input: Item) =>
        this._addState?.trigger(input)

    //-------------------------------------//

    triggerUpdate = (input: Item) =>
        this._updateState?.trigger(input)

    //-------------------------------------//

    triggerDelete = (input: Item) =>
        this._deleteState?.trigger(input)

    //-------------------------------------//

    override unsubscribe() {
        super.unsubscribe()
        this._addState?.unsubscribe()
        this._deleteState?.unsubscribe()
        this._updateState?.unsubscribe()
    }

    //-------------------------------------//

    private setMiniStateOnTriggerFn = (miniState: MiniState<Item, any>, onTriggerFn?: (input: Item) => void) => 
        miniState.setOnTriggerFn((item: Item) => {
            this._loadingBs.next(true)
            onTriggerFn?.(item)
        })

    //-------------------------------------//

    private setMiniStateErrorMsg = (miniState: MiniState<Item, any>) => 
        miniState.setOnErrorFn((input: Item, error: any) => {
            this._loadingBs.next(false)
            this.emitErrorMsg(this._errorMsgFn(error))
        })

    //-------------------------------------//

    private setMiniStateOnSuccessFn(
        miniState: MiniState<Item, any>,
        successFn?: (input: Item, output: Item | undefined, data: Item[]) => Item[],
        successMsgFn?: (input: Item, output: any | undefined) => string) {

        miniState.setOnSuccessFn((input: Item, output: Item | undefined) => {

            this._loadingBs.next(false)
            this.emitSuccessMsg(successMsgFn?.(input, output))

            const currentData = this.data() ?? []
            const updatedData = successFn?.(input, output, currentData) ?? []
            this._successDataBs.next([...updatedData])

        })
    }

    //-------------------------------------//

    override clearPopups() {
        super.clearPopups()
        this._addState?.clearPopups()
        this._updateState?.clearPopups()
        this._deleteState?.clearPopups()
    }

    //-------------------------------------//

}//Cls
