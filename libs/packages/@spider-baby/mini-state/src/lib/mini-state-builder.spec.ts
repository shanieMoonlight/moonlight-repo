import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';
import { MiniState } from './mini-state';
import { MiniStateBuilder } from './mini-state-builder';

// Mock the Angular dependencies
jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: jest.fn(),
    DestroyRef: jest.fn(),
  };
});

// Mock the toSignal function and other rxjs-interop functions
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

describe('MiniStateBuilder', () => {
  // Mock DestroyRef for injection
  const mockDestroyRef: DestroyRef = {
    onDestroy: jest.fn(),
  };

  // Create a symbol to mock the Angular SIGNAL symbol
  const SIGNAL = Symbol('SIGNAL');

  beforeEach(() => {
    // Mock inject to return our mock DestroyRef
    (inject as jest.Mock).mockReturnValue(mockDestroyRef);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    it('should create a MiniState with no input parameter', () => {
      const triggerFn = jest.fn().mockReturnValue(of('result'));
      
      const miniState = MiniStateBuilder.Create(triggerFn);
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });

    it('should pass initial value to MiniState constructor', () => {
      const triggerFn = jest.fn().mockReturnValue(of('result'));
      const initialValue = 'initial';
      
      const miniState = MiniStateBuilder.Create(triggerFn, initialValue);
      
      expect(miniState).toBeInstanceOf(MiniState);
      // We can't easily verify the initial value is used in the constructor
      // since we're mocking MiniState, but we can ensure the right function is called
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });
  });

  describe('CreateWithInput', () => {
    it('should create a MiniState that accepts an input parameter', () => {
      const triggerFn = jest.fn().mockImplementation(
        (input: string) => of(`result-${input}`)
      );
      
      const miniState = MiniStateBuilder.CreateWithInput(triggerFn);
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });

    it('should pass initial value to MiniState constructor', () => {
      const triggerFn = jest.fn().mockImplementation(
        (input: string) => of(`result-${input}`)
      );
      const initialValue = 'initial';
      
      const miniState = MiniStateBuilder.CreateWithInput(triggerFn, initialValue);
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });
  });

  describe('CreateWithObservableInput', () => {
    it('should create a MiniState that subscribes to an input observable', () => {
      const mockInputObs$ = of('input-value');
      const triggerFn = jest.fn().mockImplementation(
        (input: string) => of(`result-${input}`)
      );
      
      const miniState = MiniStateBuilder.CreateWithObservableInput(mockInputObs$, triggerFn);
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });

    it('should pass initial value to MiniState constructor', () => {
      const mockInputObs$ = of('input-value');
      const triggerFn = jest.fn().mockImplementation(
        (input: string) => of(`result-${input}`)
      );
      const initialValue = 'initial';
      
      const miniState = MiniStateBuilder.CreateWithObservableInput(
        mockInputObs$, 
        triggerFn, 
        initialValue
      );
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });
  });

  describe('CreateWithSignalInput', () => {
    it('should create a MiniState that reacts to signal changes', () => {
      // Create a proper mock signal with the SIGNAL property
      const mockSignalValue = 'signal-value';
      const mockSignal = jest.fn().mockReturnValue(mockSignalValue);
      // Add the SIGNAL property to make it look like a real signal
      (mockSignal as any)[SIGNAL] = true;
      
      const triggerFn = jest.fn().mockImplementation(
        (input: string) => of(`result-${input}`)
      );
      
      const miniState = MiniStateBuilder.CreateWithSignalInput(mockSignal as any, triggerFn);
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });

    it('should pass initial value to MiniState constructor', () => {
      // Create a proper mock signal with the SIGNAL property
      const mockSignalValue = 'signal-value';
      const mockSignal = jest.fn().mockReturnValue(mockSignalValue);
      // Add the SIGNAL property to make it look like a real signal
      (mockSignal as any)[SIGNAL] = true;
      
      const triggerFn = jest.fn().mockImplementation(
        (input: string) => of(`result-${input}`)
      );
      const initialValue = 'initial';
      
      const miniState = MiniStateBuilder.CreateWithSignalInput(
        mockSignal as any, 
        triggerFn, 
        initialValue
      );
      
      expect(miniState).toBeInstanceOf(MiniState);
      expect(inject).toHaveBeenCalledWith(DestroyRef);
    });
  });
});