import { Observable } from "rxjs"
import { MiniState } from "./mini-state"
import { MiniStateBuilder } from "./mini-state-builder"
import { DestroyRef, inject } from "@angular/core"

//=========================================================//

/**
 * A specialized MiniState extension for CRUD operations on collections of items.
 * 
 * MiniCrudState extends MiniState to provide automatic handling of common CRUD
 * (Create, Read, Update, Delete) operations, including client-side data updates
 * and efficient state management.
 * 
 * This class handles the tedious work of updating the client-side array when items
 * are added, updated, or deleted, making CRUD UIs much easier to implement.
 * 
 * @template Filter - The type of input used for filtering/retrieving the collection
 * @template Item - The type of items in the collection
 * 
 * @example
 * ```typescript
 * // Create a CRUD state for user management
 * const userCrudState = MiniCrudState.Create(
 *   (filter: UserFilter) => userService.getAll(filter)
 * )
 * .setAddState(
 *   (user: User) => userService.create(user),
 *   (user, result) => `User ${user.name} was created successfully!`
 * )
 * .setUpdateState(
 *   (user: User) => userService.update(user),
 *   (user, result) => `User ${user.name} was updated successfully!`
 * )
 * .setDeleteState(
 *   (user: User) => userService.delete(user.id),
 *   (user, result) => `User ${user.name} was deleted successfully!`
 * );
 * 
 * // Use the CRUD state in a component
 * userCrudState.trigger(new UserFilter()); // Load all users
 * userCrudState.triggerAdd(newUser);        // Add a user
 * userCrudState.triggerUpdate(updatedUser); // Update a user
 * userCrudState.triggerDelete(userToDelete); // Delete a user
 * ```
 */
export class MiniCrudState<Filter, Item> extends MiniState<Filter, Item[]> {

    private _addState?: MiniState<Item, Item | undefined>
    private _updateState?: MiniState<Item, Item | undefined>
    private _deleteState?: MiniState<Item, any>

    /**
     * Function used to determine if two items are equal.
     * By default, compares the 'id' property of the items.
     */
    private equals: (item1?: Item, item2?: Item) => boolean =
        ((item1?: Item, item2?: Item) => (item1 as any)?.id === (item2 as any)?.id)

    //-------------------------------------//

    /**
     * Creates a new MiniCrudState instance.
     * Use MiniCrudState.Create() factory method instead of calling this constructor directly.
     * 
     * @param triggerFn$ Function to fetch the collection of items
     */
    private constructor(triggerFn$: (input: Filter) => Observable<Item[]>) {
        const destroyer = inject(DestroyRef); // Dynamically inject DestroyRef
        super(triggerFn$,destroyer, [])
        console.log('ctor')
    }

    //-------------------------------------//

    /**
     * Creates a new MiniCrudState instance for managing CRUD operations on a collection.
     * 
     * @template Filter - The type of input for filtering/retrieving the collection
     * @template Item - The type of items in the collection
     * @param triggerFn$ - Function to fetch the collection of items
     * @returns A new MiniCrudState instance
     */
    static Create = <Filter, Item>(triggerFn$: (input: Filter) => Observable<Item[]>) =>
        new MiniCrudState<Filter, Item>(triggerFn$)

    //-------------------------------------//

    /**
     * Sets the function used to determine if two items are equal.
     * This is used for finding items to update or delete in the collection.
     * 
     * @param equals Function that compares two items and returns true if they are the same item
     * @returns This MiniCrudState instance for method chaining
     */
    setEqualsFn(equals?: (item1?: Item, item2?: Item) => boolean) {
        this.equals = equals ?? ((item1?: Item, item2?: Item) => (item1 as any)?.id === (item2 as any)?.id)
        return this
    }

    //-------------------------------------//

    /**
     * Configures the add operation for this CRUD state.
     * 
     * @param triggerFn$ Function that performs the add operation
     * @param successMsgFn Optional function to generate a success message after adding an item
     * @param onTriggerFn Optional function to call when the add operation is triggered
     * @returns This MiniCrudState instance for method chaining
     */
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

    /**
     * Configures the update operation for this CRUD state.
     * 
     * @param triggerFn$ Function that performs the update operation
     * @param successMsgFn Optional function to generate a success message after updating an item
     * @param onTriggerFn Optional function to call when the update operation is triggered
     * @returns This MiniCrudState instance for method chaining
     */
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

    /**
     * Configures the delete operation for this CRUD state.
     * 
     * @template DeleteResult The type of result returned by the delete operation
     * @param triggerFn$ Function that performs the delete operation
     * @param successMsgFn Function to generate a success message after deleting an item
     * @param onTriggerFn Optional function to call when the delete operation is triggered
     * @returns This MiniCrudState instance for method chaining
     */
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

    /**
     * Triggers the add operation with the provided item.
     * 
     * @param input The item to add
     * @returns The internal MiniState for the add operation
     */
    triggerAdd = (input: Item) =>
        this._addState?.trigger(input)

    //-------------------------------------//

    /**
     * Triggers the update operation with the provided item.
     * 
     * @param input The item to update
     * @returns The internal MiniState for the update operation
     */
    triggerUpdate = (input: Item) =>
        this._updateState?.trigger(input)

    //-------------------------------------//

    /**
     * Triggers the delete operation with the provided item.
     * 
     * @param input The item to delete
     * @returns The internal MiniState for the delete operation
     */
    triggerDelete = (input: Item) =>
        this._deleteState?.trigger(input)

    //-------------------------------------//

    /**
     * Stops all ongoing operations and cleans up resources.
     * This includes the main state as well as the add, update, and delete states.
     */
    override unsubscribe() {
        super.unsubscribe()
        this._addState?.unsubscribe()
        this._deleteState?.unsubscribe()
        this._updateState?.unsubscribe()
    }

    //-------------------------------------//

    /**
     * Sets up the onTrigger function for a MiniState instance used internally.
     * 
     * @param miniState The MiniState to configure
     * @param onTriggerFn Optional function to call when the operation is triggered
     */
    private setMiniStateOnTriggerFn = (miniState: MiniState<Item, any>, onTriggerFn?: (input: Item) => void) => 
        miniState.setOnTriggerFn((item: Item) => {
            this._loadingBs.next(true)
            onTriggerFn?.(item)
        })

    //-------------------------------------//

    /**
     * Sets up the error handling for a MiniState instance used internally.
     * 
     * @param miniState The MiniState to configure
     */
    private setMiniStateErrorMsg = (miniState: MiniState<Item, any>) => 
        miniState.setOnErrorFn((input: Item, error: any) => {
            this._loadingBs.next(false)
            this.emitErrorMsg(this._errorMsgFn(error))
        })

    //-------------------------------------//

    /**
     * Sets up the success handling for a MiniState instance used internally.
     * 
     * @param miniState The MiniState to configure
     * @param successFn Function to update the data array on success
     * @param successMsgFn Optional function to generate a success message
     */
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

    /**
     * Clears all popup messages and resets loading state for all internal states.
     */
    override clearPopups() {
        super.clearPopups()
        this._addState?.clearPopups()
        this._updateState?.clearPopups()
        this._deleteState?.clearPopups()
    }

    //-------------------------------------//

}//Cls
