export class ActiveOperationsTracker<T> {

    private _activeOperations = new Set<T>();
    private _loadingCallback?: (isLoading: boolean) => void;


    constructor(loadingCallback?: (isLoading: boolean) => void) {
        this._loadingCallback = loadingCallback;
    }

    //---------------------------//

    // Add an operation to the tracker
    addOperation(operation: T): void {
        this._activeOperations.add(operation);
        this._loadingCallback?.(true);
    }

    // Remove an operation from the tracker
    removeOperation(operation: T): void {
        this._activeOperations.delete(operation);
        if (this._activeOperations.size === 0) {
            this._loadingCallback?.(false);
        }
    }

    // Reset all operations
    reset(): void {
        this._activeOperations.clear();
        this._loadingCallback?.(false);
    }

    //---------------------------//

    // Get the count of active operations
    get count(): number {
        return this._activeOperations.size;
    }

    // Check if there are any active operations
    get hasActiveOperations(): boolean {
        return this._activeOperations.size > 0;
    }

}//Cls