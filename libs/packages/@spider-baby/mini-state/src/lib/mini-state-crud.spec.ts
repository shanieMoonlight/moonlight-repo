import { DestroyRef } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { MiniCrudState } from './mini-state-crud';

// Mock the Angular dependencies
jest.mock('@angular/core', () => ({
  ...(jest.requireActual('@angular/core')),
  inject: jest.fn(),
  DestroyRef: jest.fn(),
}));

// Mock the toSignal function
jest.mock('@angular/core/rxjs-interop', () => ({
  toSignal: jest.fn((observable, options) => {
    // Create a simple mock signal function
    const initialState = options?.initialValue;
    let currentValue = initialState;

    // Create an object we can use to update the mock signal's value
    const signalController = {
      updateValue: (newValue: any) => {
        currentValue = newValue;
      }
    };

    // Create the mock signal function
    const mockSignal = () => currentValue;
    
    // Store controller for test access
    mockSignal._controller = signalController;
    
    // Subscribe to the observable to update the mock signal
    if (observable) {
      const subscription = observable.subscribe({
        next: (value) => signalController.updateValue(value),
        error: () => {}
      });
      
      // Store subscription so tests can clean up
      mockSignal._subscription = subscription;
    }
    
    return mockSignal;
  }),
  takeUntilDestroyed: jest.fn(() => (source) => source),
  toObservable: jest.fn((signal) => of(signal())),
}));

// Import after mocks to ensure mocks are applied
import { inject } from '@angular/core';

describe('MiniCrudState', () => {
  // Mock data and functions
  interface TestItem {
    id?: number;
    name: string;
  }
  
  const mockItems: TestItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
  
  const mockDestroyRef: DestroyRef = {
    onDestroy: jest.fn(),
  };
  
  // Helper functions for creating observables
  const createSuccessObservable = <T>(data: T) => of(data).pipe(delay(10));
  const createErrorObservable = (errorMsg: string) => 
    throwError(() => new Error(errorMsg)).pipe(delay(10));

  beforeEach(() => {
    // Mock inject to return our mock DestroyRef
    (inject as jest.Mock).mockReturnValue(mockDestroyRef);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    it('should create a MiniCrudState instance', () => {
      const getAllFn = jest.fn().mockReturnValue(of(mockItems));
      
      const crudState = MiniCrudState.Create(getAllFn);
      
      expect(crudState).toBeInstanceOf(MiniCrudState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });
  });

  describe('CRUD operations', () => {
    let crudState: MiniCrudState<string, TestItem>;
    let getAllFn: jest.Mock;
    
    beforeEach(() => {
      getAllFn = jest.fn().mockReturnValue(createSuccessObservable(mockItems));
      crudState = MiniCrudState.Create(getAllFn);
    });
    
    describe('trigger (Read)', () => {
      it('should load items with the getAllFn', (done) => {
        const filter = 'test-filter';
        const successDataBs = (crudState as any)._successDataBs;
        const dataNextSpy = jest.spyOn(successDataBs, 'next');
        
        crudState.trigger(filter);
        
        setTimeout(() => {
          expect(getAllFn).toHaveBeenCalledWith(filter);
          expect(dataNextSpy).toHaveBeenCalledWith(mockItems);
          done();
        }, 20);
      });
      
      it('should handle errors in getAllFn', (done) => {
        const errorMsg = 'Failed to load items';
        getAllFn.mockReturnValue(createErrorObservable(errorMsg));
        
        const errorMsgBs = (crudState as any)._errorMsgBs;
        const errorNextSpy = jest.spyOn(errorMsgBs, 'next');
        
        crudState.trigger('filter');
        
        setTimeout(() => {
          expect(errorNextSpy).toHaveBeenCalled();
          const errorArg = errorNextSpy.mock.calls[1][0]; // The second call (after clearing)
          expect(errorArg).toContain(errorMsg);
          done();
        }, 20);
      });
    });
    
    describe('setAddState', () => {
      it('should configure the add state with appropriate functions', () => {
        const createFn = jest.fn().mockReturnValue(of({ id: 4, name: 'New Item' }));
        const successMsgFn = jest.fn().mockReturnValue('Item added successfully');
        const onTriggerFn = jest.fn();
        
        // Configure the add state initially
        crudState.setAddState(createFn, successMsgFn, onTriggerFn);
        
        // Verify the add state was created
        const addState = (crudState as any)._addState;
        expect(addState).toBeDefined();
        
        // Mock the methods we want to test
        const setOnTriggerFnSpy = jest.spyOn(crudState as any, 'setMiniStateOnTriggerFn');
        const setErrorMsgSpy = jest.spyOn(crudState as any, 'setMiniStateErrorMsg');
        const setOnSuccessFnSpy = jest.spyOn(crudState as any, 'setMiniStateOnSuccessFn');
        
        // We need to call setAddState again to trigger the spies after they've been created
        crudState.setAddState(createFn, successMsgFn, onTriggerFn);
        
        // Verify the spies were called with the correct arguments
        // Using expect.any to avoid deep comparison issues with complex objects
        expect(setOnTriggerFnSpy).toHaveBeenCalledWith(expect.anything(), onTriggerFn);
        expect(setErrorMsgSpy).toHaveBeenCalledWith(expect.anything());
        expect(setOnSuccessFnSpy).toHaveBeenCalled();
        
        // Verify the correct success message function was passed to setMiniStateOnSuccessFn
        const successFnCallArgs = setOnSuccessFnSpy.mock.calls[0];
        expect(successFnCallArgs[2]).toBe(successMsgFn);
      });
      
      it('should handle errors in add operation', (done) => {
        const newItem: TestItem = { name: 'New Item' };
        const errorMsg = 'Failed to add item';
        const createFn = jest.fn().mockReturnValue(createErrorObservable(errorMsg));
        
        crudState
          .setAddState(createFn)
          .trigger('filter'); // Load initial data
        
        setTimeout(() => {
          // Reset spies after initial loading
          jest.clearAllMocks();
          
          // Now spy on the internal subjects
          const errorMsgBs = (crudState as any)._errorMsgBs;
          const errorNextSpy = jest.spyOn(errorMsgBs, 'next');
          
          // Now trigger the add operation
          crudState.triggerAdd(newItem);
          
          setTimeout(() => {
            expect(createFn).toHaveBeenCalledWith(newItem);
            
            // Check error message was emitted
            expect(errorNextSpy).toHaveBeenCalled();
            const errorArg = errorNextSpy.mock.calls[0][0];
            expect(errorArg).toContain(errorMsg);
            
            done();
          }, 20);
        }, 20);
      });
    });
    
    describe('setUpdateState', () => {
      it('should configure the update state with appropriate functions', () => {
        const updateFn = jest.fn().mockReturnValue(of({ id: 2, name: 'Updated Item' }));
        const successMsgFn = jest.fn().mockReturnValue('Item updated successfully');
        const onTriggerFn = jest.fn();
        
        // Configure the update state initially
        crudState.setUpdateState(updateFn, successMsgFn, onTriggerFn);
        
        // Verify the update state was created
        const updateState = (crudState as any)._updateState;
        expect(updateState).toBeDefined();
        
        // Mock the methods we want to test
        const setOnTriggerFnSpy = jest.spyOn(crudState as any, 'setMiniStateOnTriggerFn');
        const setErrorMsgSpy = jest.spyOn(crudState as any, 'setMiniStateErrorMsg');
        const setOnSuccessFnSpy = jest.spyOn(crudState as any, 'setMiniStateOnSuccessFn');
        
        // We need to call setUpdateState again to trigger the spies after they've been created
        crudState.setUpdateState(updateFn, successMsgFn, onTriggerFn);
        
        // Verify the spies were called with the correct arguments
        // Using expect.any to avoid deep comparison issues with complex objects
        expect(setOnTriggerFnSpy).toHaveBeenCalledWith(expect.anything(), onTriggerFn);
        expect(setErrorMsgSpy).toHaveBeenCalledWith(expect.anything());
        expect(setOnSuccessFnSpy).toHaveBeenCalled();
        
        // Verify the correct success message function was passed to setMiniStateOnSuccessFn
        const successFnCallArgs = setOnSuccessFnSpy.mock.calls[0];
        expect(successFnCallArgs[2]).toBe(successMsgFn);
      });
      
      it('should handle errors in update operation', (done) => {
        const itemToUpdate = { ...mockItems[1], name: 'Updated Item' };
        const errorMsg = 'Failed to update item';
        const updateFn = jest.fn().mockReturnValue(createErrorObservable(errorMsg));
        
        crudState
          .setUpdateState(updateFn)
          .trigger('filter'); // Load initial data
        
        setTimeout(() => {
          // Reset spies after initial loading
          jest.clearAllMocks();
          
          // Now spy on the internal subjects
          const errorMsgBs = (crudState as any)._errorMsgBs;
          const errorNextSpy = jest.spyOn(errorMsgBs, 'next');
          
          // Now trigger the update operation
          crudState.triggerUpdate(itemToUpdate);
          
          setTimeout(() => {
            expect(updateFn).toHaveBeenCalledWith(itemToUpdate);
            
            // Check error message was emitted
            expect(errorNextSpy).toHaveBeenCalled();
            const errorArg = errorNextSpy.mock.calls[0][0];
            expect(errorArg).toContain(errorMsg);
            
            done();
          }, 20);
        }, 20);
      });
    });
    
    describe('setDeleteState', () => {
      it('should configure the delete state with appropriate functions', () => {
        const deleteFn = jest.fn().mockReturnValue(of({ success: true }));
        const successMsgFn = jest.fn().mockReturnValue('Item deleted successfully');
        const onTriggerFn = jest.fn();
        
        // Configure the delete state
        crudState.setDeleteState(deleteFn, successMsgFn, onTriggerFn);
        
        // Verify the delete state was created
        const deleteState = (crudState as any)._deleteState;
        expect(deleteState).toBeDefined();
        
        // Create spies to inspect the configuration of the delete state
        const setOnTriggerFnSpy = jest.spyOn(crudState as any, 'setMiniStateOnTriggerFn');
        const setErrorMsgSpy = jest.spyOn(crudState as any, 'setMiniStateErrorMsg');
        const setOnSuccessFnSpy = jest.spyOn(crudState as any, 'setMiniStateOnSuccessFn');
        
        // Reconfigure to trigger the spies
        crudState.setDeleteState(deleteFn, successMsgFn, onTriggerFn);
        
        // Verify the functions were properly set
        expect(setOnTriggerFnSpy).toHaveBeenCalledWith(deleteState, onTriggerFn);
        expect(setErrorMsgSpy).toHaveBeenCalledWith(deleteState);
        expect(setOnSuccessFnSpy).toHaveBeenCalled();
        
        // Verify the underlying function was passed to the MiniState
        const callArgs = setOnSuccessFnSpy.mock.calls[0];
        expect(callArgs[0]).toBe(deleteState);
        expect(callArgs[2]).toBe(successMsgFn);
      });
      
      it('should handle errors in delete operation', (done) => {
        const itemToDelete = mockItems[1];
        const errorMsg = 'Failed to delete item';
        const deleteFn = jest.fn().mockReturnValue(createErrorObservable(errorMsg));
        
        crudState
          .setDeleteState(
            deleteFn, 
            () => 'Success message (should not be called)'
          )
          .trigger('filter'); // Load initial data
        
        setTimeout(() => {
          // Reset spies after initial loading
          jest.clearAllMocks();
          
          // Now spy on the internal subjects
          const errorMsgBs = (crudState as any)._errorMsgBs;
          const errorNextSpy = jest.spyOn(errorMsgBs, 'next');
          
          // Now trigger the delete operation
          crudState.triggerDelete(itemToDelete);
          
          setTimeout(() => {
            expect(deleteFn).toHaveBeenCalledWith(itemToDelete);
            
            // Check error message was emitted
            expect(errorNextSpy).toHaveBeenCalled();
            const errorArg = errorNextSpy.mock.calls[0][0];
            expect(errorArg).toContain(errorMsg);
            
            done();
          }, 20);
        }, 20);
      });
    });
  });

  describe('setEqualsFn', () => {
    it('should set custom equals function for item comparison', () => {
      interface CustomItem {
        userId: number;
        itemId: number;
        name: string;
      }
      
      const customItems: CustomItem[] = [
        { userId: 1, itemId: 1, name: 'Item 1' },
        { userId: 1, itemId: 2, name: 'Item 2' },
        { userId: 2, itemId: 1, name: 'Item 3' }
      ];
      
      const getAllFn = jest.fn().mockReturnValue(of(customItems));
      
      // Define custom equality function
      const customEqualsFn = (item1?: CustomItem, item2?: CustomItem) => 
        item1?.userId === item2?.userId && item1?.itemId === item2?.itemId;
      
      // Create a CRUD state with custom equality function
      const crudState = MiniCrudState.Create<string, CustomItem>(getAllFn)
        .setEqualsFn(customEqualsFn);
      
      // Verify the equals function was set
      expect((crudState as any).equals).toBe(customEqualsFn);
      
      // Set up delete state for testing equals function passing
      const deleteFn = jest.fn().mockReturnValue(of({ success: true }));
      crudState.setDeleteState(deleteFn, () => 'Deleted');
      
      // Check that we're properly accessing the private property
      expect((crudState as any)._deleteState).toBeDefined();
      
      // Create a spy to check if the success data processor uses our custom equals function
      // We'll spy on the setSuccessDataProcessorFn method if it's called when setting the delete state
      const processorSpy = jest.spyOn(crudState as any, 'setMiniStateOnSuccessFn');
      
      // Simulate calling setDeleteState again to capture the function
      crudState.setDeleteState(deleteFn, () => 'Deleted again');
      
      // Verify that the setMiniStateOnSuccessFn was called
      expect(processorSpy).toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should clean up resources including sub-states', () => {
      const getAllFn = jest.fn().mockReturnValue(of(mockItems));
      
      const crudState = MiniCrudState.Create(getAllFn)
        .setAddState(() => of({}))
        .setUpdateState(() => of({}))
        .setDeleteState(() => of({}), () => '');
      
      // Create spies for the unsubscribe methods
      const mainStateSpy = jest.spyOn(crudState, 'unsubscribe').mockImplementation(jest.fn() as any);
      
      // Replace the sub-states with mocks that have spies
      const mockUnsubscribe = jest.fn();
      (crudState as any)._addState = { unsubscribe: mockUnsubscribe };
      (crudState as any)._updateState = { unsubscribe: mockUnsubscribe };
      (crudState as any)._deleteState = { unsubscribe: mockUnsubscribe };
      
      // Call original unsubscribe (not the mock)
      Object.getPrototypeOf(crudState).unsubscribe.call(crudState);
      
      // Verify all states were unsubscribed
      expect(mockUnsubscribe).toHaveBeenCalledTimes(3);
    });
  });
});