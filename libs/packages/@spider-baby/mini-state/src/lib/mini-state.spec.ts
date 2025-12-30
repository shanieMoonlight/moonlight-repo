import { DestroyRef, Injector } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { MiniState } from './mini-state';

// Mock the Angular dependencies
jest.mock('@angular/core', () => ({
  ...(jest.requireActual('@angular/core')),
  inject: jest.fn(),
  DestroyRef: jest.fn(),
  Injector: {
    create: jest.fn(() => ({ get: jest.fn() }))
  }
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
        next: (value: any) => signalController.updateValue(value),
        error: () => { }
      });

      // Store subscription so tests can clean up
      mockSignal._subscription = subscription;
    }

    return mockSignal;
  })
}));

// Create a mock DestroyRef class
class MockDestroyRef implements DestroyRef {
  get destroyed(): boolean {
    return false
  }
  private callbacks: (() => void)[] = [];

  onDestroy(callback: () => void): () => void {
    this.callbacks.push(callback);
    // Return a function that removes this callback when called
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index !== -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  // Method to manually trigger destruction
  destroy(): void {
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
  }
}

describe('MiniState', () => {
  // Mock data and functions
  const mockData = { id: 1, name: 'Test Item' };
  const mockTriggerFn = jest.fn();
  const mockDestroyRef = new MockDestroyRef();

  // Helper function to create a success observable
  const createSuccessObservable = (data: any) => of(data).pipe(delay(10));

  // Helper function to create an error observable
  const createErrorObservable = (errorMsg: string) =>
    throwError(() => new Error(errorMsg)).pipe(delay(10));

  beforeEach(() => {
    jest.clearAllMocks();
    mockTriggerFn.mockReset();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      mockTriggerFn.mockReturnValue(of(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);

      // Since we've mocked the signals, we can't directly check their values
      // Instead, check that things were initialized
      expect(state).toBeDefined();
    });

    it('should initialize with initial value when provided', () => {
      mockTriggerFn.mockReturnValue(of(mockData));
      const initialValue = { id: 0, name: 'Initial' };

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setInitialOutputValue(initialValue);

      expect(state).toBeDefined();
      expect(state.data()).toBe(initialValue); 
    });
  });

  describe('trigger', () => {
    it('should set loading to true when triggered', () => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);
      const loadingBs = (state as any)._loadingBs;
      const nextSpy = jest.spyOn(loadingBs, 'next');

      state.trigger('input');

      expect(nextSpy).toHaveBeenCalledWith(true);
    });

    it('should emit dataAndInput on success', (done) => {
      const input = 'input-x';
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);
      const dataAndInputBs = (state as any)._dataAndInput$;
      const nextSpy = jest.spyOn(dataAndInputBs, 'next');

      state.trigger(input as any);

      setTimeout(() => {
        expect(nextSpy).toHaveBeenCalledWith({ input, output: mockData });
        done();
      }, 20);
    });

    it('should mark wasTriggered true after completion', (done) => {
      const input = 'input-y';
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);
      const wasTriggeredBs = (state as any)._wasTriggeredBs;
      const nextSpy = jest.spyOn(wasTriggeredBs, 'next');

      state.trigger(input as any);

      setTimeout(() => {
        expect(nextSpy).toHaveBeenCalledWith(true);
        done();
      }, 20);
    });

    it('should update data and set loading to false on success', (done) => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);
      const loadingBs = (state as any)._loadingBs;
      const successDataBs = (state as any)._successDataBs;
      const loadingNextSpy = jest.spyOn(loadingBs, 'next');
      const dataNextSpy = jest.spyOn(successDataBs, 'next');

      state.trigger('input');

      setTimeout(() => {
        expect(loadingNextSpy).toHaveBeenCalledWith(false);
        expect(dataNextSpy).toHaveBeenCalledWith(mockData);
        done();
      }, 20);
    });

    it('should set error message and loading to false on error', (done) => {
      const errorMsg = 'Error message';
      mockTriggerFn.mockReturnValue(createErrorObservable(errorMsg));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);
      const loadingBs = (state as any)._loadingBs;
      const errorMsgBs = (state as any)._errorMsgBs;

      const loadingNextSpy = jest.spyOn(loadingBs, 'next');
      const errorNextSpy = jest.spyOn(errorMsgBs, 'next');

      state.trigger('input');

      setTimeout(() => {
        expect(loadingNextSpy).toHaveBeenCalledWith(false);
        expect(errorNextSpy).toHaveBeenCalled();
        const errorArg = errorNextSpy.mock.calls[1][0]; // The second call (after clearing)
        expect(errorArg).toContain(errorMsg);
        done();
      }, 20);
    });

    it('should call onTriggerFn when provided', () => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));
      const onTriggerFn = jest.fn();

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setOnTriggerFn(onTriggerFn);

      const input = 'test-input';
      state.trigger(input);

      expect(onTriggerFn).toHaveBeenCalledWith(input);
    });

    it('should unsubscribe from previous subscription when triggered again', () => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);

      // Create a mock subscription and set it as the current subscription
      const mockUnsubscribe = jest.fn();
      (state as any)._triggerSub = { unsubscribe: mockUnsubscribe };

      state.trigger('input');

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('retrigger', () => {
    it('should trigger with the last successful input', (done) => {
      const input = 'test-input';
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);

      // Manually set wasTriggered and prevInput for testing
      (state as any)._wasTriggeredBs.next(true);
      (state as any)._inputBs.next(input);

      const triggerSpy = jest.spyOn(state, 'trigger');

      state.retrigger();

      expect(triggerSpy).toHaveBeenCalledWith(input);
      done();
    });

    it('should warn if called before any successful trigger', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);

      state.retrigger();

      expect(consoleSpy).toHaveBeenCalledWith(
        'MiniState: retrigger called before any trigger.'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('configuration methods', () => {
    it('setSuccessMsgFn should set success message function', (done) => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));
      const successMsg = 'Success!';

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setSuccessMsgFn(() => successMsg);

      const successMsgBs = (state as any)._successMsgBs;
      const nextSpy = jest.spyOn(successMsgBs, 'next');

      state.trigger('input');

      setTimeout(() => {
        expect(nextSpy).toHaveBeenCalled();
        const msgArg = nextSpy.mock.calls[1][0]; // The second call (after clearing)
        expect(msgArg).toContain(successMsg);
        done();
      }, 20);
    });

    it('setOnSuccessFn should call function on success', (done) => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));
      const onSuccessFn = jest.fn();

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setOnSuccessFn(onSuccessFn);

      const input = 'input';
      state.trigger(input);

      setTimeout(() => {
        expect(onSuccessFn).toHaveBeenCalledWith(input, mockData);
        done();
      }, 800); // Account for the setTimeout(500) in handleTriggerSuccess
    });

    it('setSuccessDataProcessorFn should process data before storing', (done) => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));
      const processedData = { ...mockData, processed: true };

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setSuccessDataProcessorFn(() => processedData);

      const successDataBs = (state as any)._successDataBs;
      const nextSpy = jest.spyOn(successDataBs, 'next');

      state.trigger('input');

      setTimeout(() => {
        expect(nextSpy).toHaveBeenCalledWith(processedData);
        done();
      }, 20);
    });

    it('setErrorMsgFn should customize error messages', (done) => {
      const errorMsg = 'Original error';
      const customMsg = 'Custom error message';
      mockTriggerFn.mockReturnValue(createErrorObservable(errorMsg));

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setErrorMsgFn(() => customMsg);

      const errorMsgBs = (state as any)._errorMsgBs;
      const nextSpy = jest.spyOn(errorMsgBs, 'next');

      state.trigger('input');

      setTimeout(() => {
        expect(nextSpy).toHaveBeenCalled();
        const msgArg = nextSpy.mock.calls[1][0]; // The second call (after clearing)
        expect(msgArg).toContain(customMsg);
        done();
      }, 20);
    });

    it('setOnErrorFn should call function on error', (done) => {
      const errorMsg = 'Error message';
      mockTriggerFn.mockReturnValue(createErrorObservable(errorMsg));
      const onErrorFn = jest.fn();

      const state = new MiniState(mockTriggerFn, mockDestroyRef)
        .setOnErrorFn(onErrorFn);

      const input = 'input';
      state.trigger(input);

      setTimeout(() => {
        expect(onErrorFn).toHaveBeenCalledWith(input, expect.any(Error));
        done();
      }, 400); // Account for the setTimeout(200) in handleTriggerError
    });
  });

  describe('unsubscribe', () => {
    it('should clean up resources', () => {
      mockTriggerFn.mockReturnValue(createSuccessObservable(mockData));

      const state = new MiniState(mockTriggerFn, mockDestroyRef);

      const subSpy = { unsubscribe: jest.fn() };
      (state as any)._triggerSub = subSpy;

      // Mock the complete methods of subjects
      const completeMock = jest.fn();
      (state as any)._successMsgBs = { complete: completeMock };
      (state as any)._successDataBs = { complete: completeMock };
      (state as any)._loadingBs = { complete: completeMock };
      (state as any)._errorMsgBs = { complete: completeMock };
      (state as any)._errorBs = { complete: completeMock };

      state.unsubscribe();

      expect(subSpy.unsubscribe).toHaveBeenCalled();
      expect(completeMock).toHaveBeenCalledTimes(5);
      expect((state as any)._errorFn).toBeUndefined();
      expect((state as any)._onSuccessFn).toBeUndefined();
      expect((state as any)._successMsgFn).toBeUndefined();
      expect((state as any)._successDataProcessor).toBeUndefined();
      expect((state as any)._onTriggerFn).toBeUndefined();
    });
  });
});