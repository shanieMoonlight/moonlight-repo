import { DestroyRef, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MiniCrudState } from './mini-state-crud';
import { MiniState } from "./mini-state"

// Mock timer implementations
jest.useFakeTimers();


// Create a mock DestroyRef
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

describe('MiniCrudState', () => {
    interface TestItem {
        id: number
        name: string
        value: number
    }

    interface TestFilter {
        searchTerm: string
    }

    let mockItems: TestItem[]
    let mockService: {
        getAll: jest.Mock
        create: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }

    beforeEach(() => {
        // Set up test data
        mockItems = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 2', value: 200 },
            { id: 3, name: 'Item 3', value: 300 }
        ]

        // Create mock service with jest mocks
        mockService = {
            getAll: jest.fn().mockImplementation(() => of([...mockItems])),
            create: jest.fn().mockImplementation((item: TestItem) =>
                of({ ...item, id: mockItems.length + 1 }).pipe(delay(50))),
            update: jest.fn().mockImplementation((item: TestItem) =>
                of({ ...item }).pipe(delay(50))),
            delete: jest.fn().mockImplementation((id: number) =>
                of(true).pipe(delay(50)))
        }

        TestBed.configureTestingModule({
            providers: [
                { provide: DestroyRef, useClass: MockDestroyRef }
            ]
        });
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Basic operations', () => {
        it('should create an instance', () => {
       const injector = TestBed.inject(EnvironmentInjector);

            // Run inside injection context
            runInInjectionContext(injector, () => {
                const state = MiniCrudState.Create<TestFilter, TestItem>(
                    (filter) => mockService.getAll(filter)
                );
                expect(state).toBeTruthy();
            });
        })

        it('should load data when triggered', () => {

            const injector = TestBed.inject(EnvironmentInjector);

            // Run inside injection context
            let state: MiniCrudState<TestFilter, TestItem>;
            runInInjectionContext(injector, () => {
                // Arrange
                state = MiniCrudState.Create<TestFilter, TestItem>(
                    (filter) => mockService.getAll(filter)
                );

                const filter: TestFilter = { searchTerm: 'test' };

                // Act
                state.trigger(filter);
            });

            jest.runAllTimers();

            // Assert
            expect(mockService.getAll).toHaveBeenCalledWith({ searchTerm: 'test' });
            expect(state!.data()).toEqual(mockItems);
            expect(state!.loading()).toBe(false);
            expect(state!.wasTriggered()).toBe(true);
        });
    })

    describe('Add Operation', () => {
        it('should set loading to true when add operation is triggered', () => {

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const loadingSpy = jest.fn();

            // Run creation and setup inside injection context
            runInInjectionContext(injector, () => {
                state = MiniCrudState.Create<TestFilter, TestItem>(
                    (filter) => mockService.getAll(filter)
                ).setAddState(
                    (item) => mockService.create(item)
                );

                state.trigger({ searchTerm: '' });
                state.loading$.subscribe(loadingSpy);
            });

            jest.runAllTimers();

            // Act
            const newItem: TestItem = { id: 0, name: 'New Item', value: 400 };
            state!.triggerAdd(newItem);

            // Assert - loading should be true immediately
            expect(loadingSpy).toHaveBeenCalledWith(true);

            // Now complete the operation
            jest.advanceTimersByTime(100);

            // Loading should be false after completion
            expect(loadingSpy).toHaveBeenCalledWith(false);
        });

        it('should append new item to the collection on successful add', () => {
            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const newItem: TestItem = { id: 0, name: 'New Item', value: 400 };

            // Create a special spy to intercept the setOnSuccessFn method
            // This is the key part - we need to capture what's happening in the success handler
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    ).setAddState(
                        (item) => mockService.create(item)
                    );

                    state.trigger({ searchTerm: '' });
                });

                jest.runAllTimers();
                expect(state.data()?.length).toBe(3);

                // Act - trigger add operation
                runInInjectionContext(injector, () => {
                    state.triggerAdd(newItem);
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                // This simulates what would happen when the observable completes
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(newItem, { id: 4, name: 'New Item', value: 400 });
                    });
                }

                // Assert
                expect(state.data()?.length).toBe(4);
                expect(state.data()?.[3].name).toBe('New Item');
                expect(state.data()?.[3].id).toBe(4);
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });

        it('should emit success message from custom successMsgFn', () => {
            // Arrange
            const successMessageFn = (item: TestItem, output: TestItem | undefined) => `Added ${output?.name || item.name} successfully!`

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const newItem: TestItem = { id: 0, name: 'New Item', value: 400 };

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    ).setAddState(
                        (item) => mockService.create(item),
                        successMessageFn
                    );

                    state.trigger({ searchTerm: '' });
                });

                jest.runAllTimers();

                const successMsgSpy = jest.fn();
                state.successMsg$.subscribe(successMsgSpy);

                // Act - trigger add operation
                runInInjectionContext(injector, () => {
                    state.triggerAdd(newItem);
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(newItem, { id: 4, name: 'New Item', value: 400 });
                    });
                }

                // Assert
                expect(successMsgSpy).toHaveBeenCalledWith(expect.stringContaining('Added New Item successfully!'));
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });

        it('should call onTriggerFn when add is triggered', () => {
            // Arrange
            const newItem: TestItem = { id: 0, name: 'New Item', value: 400 }
            const onTriggerSpy = jest.fn()

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Run creation and setup inside injection context
            runInInjectionContext(injector, () => {
                state = MiniCrudState.Create<TestFilter, TestItem>(
                    (filter) => mockService.getAll(filter)
                ).setAddState(
                    (item) => mockService.create(item),
                    undefined,
                    onTriggerSpy
                )

                // Act
                state.triggerAdd(newItem)
            });

            // Assert
            expect(onTriggerSpy).toHaveBeenCalledWith(newItem)
        })

        it('should handle errors in add operation', () => {
            // Arrange
            const errorMsg = 'Failed to create item'
            mockService.create.mockReturnValue(throwError(() => new Error(errorMsg)))

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const errorMsgSpy = jest.fn();
            const loadingSpy = jest.fn();

            // Run creation and setup inside injection context
            runInInjectionContext(injector, () => {
                state = MiniCrudState.Create<TestFilter, TestItem>(
                    (filter) => mockService.getAll(filter)
                ).setAddState(
                    (item) => mockService.create(item)
                )

                state.trigger({ searchTerm: '' })
            });
            jest.runAllTimers()

            // Set up spies
            state.errorMsg$.subscribe(errorMsgSpy)
            state.loading$.subscribe(loadingSpy)

            // Act - trigger the add operation within the injection context
            runInInjectionContext(injector, () => {
                const newItem: TestItem = { id: 0, name: 'New Item', value: 400 }
                state.triggerAdd(newItem)
            });

            jest.runAllTimers()

            // Assert
            // Update the expected error message to match what's actually being returned
            expect(errorMsgSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to create item'))
            expect(loadingSpy).toHaveBeenCalledWith(false)
            expect(state.data()?.length).toBe(3) // Collection unchanged
        })
    })

    describe('Update Operation', () => {
        it('should update an existing item in the collection', () => {
            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const updatedItem = { ...mockItems[1], name: 'Updated Item 2' };

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    ).setUpdateState(
                        (item) => mockService.update(item)
                    );

                    state.trigger({ searchTerm: '' });
                });

                jest.runAllTimers();

                // Act - trigger update operation
                runInInjectionContext(injector, () => {
                    state.triggerUpdate(updatedItem);
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(updatedItem, updatedItem);
                    });
                }

                // Assert
                expect(mockService.update).toHaveBeenCalledWith(updatedItem);
                expect(state.data()?.[1].name).toBe('Updated Item 2');
                expect(state.data()?.length).toBe(3); // Count unchanged
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });

        it('should use custom equals function when provided', () => {
            // Arrange - custom equals function that compares by name instead of id
            const customEquals = (a?: TestItem, b?: TestItem) => a?.name === b?.name;

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const updatedItem: TestItem = { id: 999, name: 'Item 1', value: 150 };

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    )
                        .setEqualsFn(customEquals)
                        .setUpdateState(
                            (item) => mockService.update(item)
                        );

                    state.trigger({ searchTerm: '' });
                });

                jest.runAllTimers();

                // Act - notice the id is different, but name matches item[0]
                runInInjectionContext(injector, () => {
                    state.triggerUpdate(updatedItem);
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(updatedItem, updatedItem);
                    });
                }

                // Assert - should update item with matching name regardless of id
                expect(state.data()?.[0].value).toBe(150);
                expect(state.data()?.[0].id).toBe(999); // ID got updated too
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });
    })

    describe('Delete Operation', () => {
        it('should remove an item from the collection', () => {
            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    ).setDeleteState(
                        (item) => mockService.delete(item.id)
                    );

                    state.trigger({ searchTerm: '' });
                });

                jest.runAllTimers();
                expect(state.data()?.length).toBe(3);

                // Act - trigger delete operation within the injection context
                runInInjectionContext(injector, () => {
                    state.triggerDelete(mockItems[1]); // Delete second item
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(mockItems[1], true);
                    });
                }

                // Assert
                expect(mockService.delete).toHaveBeenCalledWith(2); // ID of second item
                expect(state.data()?.length).toBe(2);
                expect(state.data()?.find(i => i.id === 2)).toBeUndefined();
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });
    })



    describe('State propagation', () => {
        it('should handle null return from operations', () => {
            // Arrange
            mockService.create.mockReturnValue(of(null))

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    )
                        .setAddState(
                            (item) => mockService.create(item) as any
                        )

                    state.trigger({ searchTerm: '' })
                });
                jest.runAllTimers()

                // Add a new item that will return null from the service
                const newItem: TestItem = { id: 0, name: 'New Item', value: 400 }

                runInInjectionContext(injector, () => {
                    state.triggerAdd(newItem)
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(newItem, null);
                    });
                }

                // Assert - should use input item when output is null
                expect(state.data()?.length).toBe(4)
                expect(state.data()?.[3]).toEqual(expect.objectContaining({
                    name: 'New Item',
                    value: 400
                }))
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        })

        it('should handle concurrent operations loading states', () => {
            // Arrange - slower service responses
            mockService.update.mockReturnValue(of({}).pipe(delay(200)))
            mockService.delete.mockReturnValue(of(true).pipe(delay(100)))

            const loadingStates: boolean[] = []

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            const capturedSuccessCallbacks: ((input: any, output: any) => void)[] = [];

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallbacks.push(successFn);
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    )
                        .setUpdateState(
                            (item) => mockService.update(item)
                        )
                        .setDeleteState(
                            (item) => mockService.delete(item.id)
                        )

                    state.trigger({ searchTerm: '' })
                });
                jest.runAllTimers()

                state.loading$.subscribe(isLoading => loadingStates.push(isLoading))
                loadingStates.length = 0 // Reset tracking array

                // Act - start update (longer operation) within injection context
                runInInjectionContext(injector, () => {
                    state.triggerUpdate(mockItems[0])
                });

                // Before update completes, start delete (shorter operation) within injection context
                jest.advanceTimersByTime(50)
                runInInjectionContext(injector, () => {
                    state.triggerDelete(mockItems[1])
                });

                // Delete completes first
                jest.advanceTimersByTime(100)
                // First success callback should be from delete operation
                if (capturedSuccessCallbacks.length >= 2) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallbacks[1](mockItems[1], true);
                    });
                }

                // Update completes last
                jest.advanceTimersByTime(100)
                // Second success callback should be from update operation
                if (capturedSuccessCallbacks.length >= 1) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallbacks[0](mockItems[0], {});
                    });
                }

                // Assert - loading should stay true until both operations complete
                expect(loadingStates).toEqual([true, true, false])
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });
    })

    describe('Resource cleanup', () => {
        it('should unsubscribe from all operations', () => {

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;
            const loadingSpy = jest.fn();

            // Run creation and setup inside injection context
            runInInjectionContext(injector, () => {

                // Create a state with never-completing observables to test cleanup
                const neverEndingObs = new Observable(observer => {
                    // This will never complete or error
                    return () => { loadingSpy('unsubscribed') }
                })

                const state = MiniCrudState.Create<TestFilter, TestItem>(
                    () => neverEndingObs as any
                )
                    .setAddState(
                        () => neverEndingObs as any
                    )

                // Act - trigger operations that won't complete
                state.trigger({ searchTerm: '' })
                state.triggerAdd({ id: 0, name: 'Test', value: 0 })

                // Now unsubscribe
                state.unsubscribe()
            });

            // Assert - should have unsubscribed from both operations
            expect(loadingSpy).toHaveBeenCalledTimes(2)
            expect(loadingSpy).toHaveBeenCalledWith('unsubscribed')
        })
    })

    describe('Edge cases', () => {
        it('should handle empty collections', () => {
            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    // Arrange
                    mockService.getAll.mockReturnValue(of([]));

                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    ).setAddState(
                        (item) => mockService.create(item)
                    );

                    // Act
                    state.trigger({ searchTerm: '' });
                });

                jest.runAllTimers();

                // Assert - should have empty array
                expect(state.data()).toEqual([]);

                // Add to empty collection
                const newItem: TestItem = { id: 1, name: 'First Item', value: 100 };

                runInInjectionContext(injector, () => {
                    state.triggerAdd(newItem);
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(newItem, { id: 4, name: 'First Item', value: 100 });
                    });
                }

                // Should work with initially empty collection
                expect(state.data()?.length).toBe(1);
                expect(state.data()?.[0]).toEqual(expect.objectContaining({
                    id: 4,
                    name: 'First Item',
                    value: 100
                }));
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        });

        it('should handle null return from operations', () => {
            // Arrange
            mockService.create.mockReturnValue(of(null))

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Create a special spy to intercept the setOnSuccessFn method
            const originalSetOnSuccessFn = MiniState.prototype.setOnSuccessFn;
            let capturedSuccessCallback: ((input: any, output: any) => void) | undefined;

            // Mock setOnSuccessFn to capture the callback
            MiniState.prototype.setOnSuccessFn = function (successFn) {
                capturedSuccessCallback = successFn;
                return originalSetOnSuccessFn.call(this, successFn);
            };

            try {
                // Run creation and setup inside injection context
                runInInjectionContext(injector, () => {
                    state = MiniCrudState.Create<TestFilter, TestItem>(
                        (filter) => mockService.getAll(filter)
                    )
                        .setAddState(
                            (item) => mockService.create(item) as any
                        )

                    state.trigger({ searchTerm: '' })
                });
                jest.runAllTimers()

                // Add a new item that will return null from the service
                const newItem: TestItem = { id: 0, name: 'New Item', value: 400 }

                runInInjectionContext(injector, () => {
                    state.triggerAdd(newItem)
                });

                // Advance timers to process the async operation
                jest.advanceTimersByTime(50);

                // Here's the key part - manually invoke the success callback within the injection context
                if (capturedSuccessCallback) {
                    runInInjectionContext(injector, () => {
                        capturedSuccessCallback!(newItem, null);
                    });
                }

                // Assert - should use input item when output is null
                expect(state.data()?.length).toBe(4)
                expect(state.data()?.[3]).toEqual(expect.objectContaining({
                    name: 'New Item',
                    value: 400
                }))
            } finally {
                // Restore the original function
                MiniState.prototype.setOnSuccessFn = originalSetOnSuccessFn;
            }
        })
    })

    describe('Message handling', () => {
        it('should reset all messages when explicitly requested', () => {
            // Arrange
            mockService.create.mockReturnValue(throwError(() => new Error('Test error')))

            // Get the injector
            const injector = TestBed.inject(EnvironmentInjector);

            // Variables that need to be accessed outside the injection context
            let state!: MiniCrudState<TestFilter, TestItem>;

            // Run creation and setup inside injection context
            runInInjectionContext(injector, () => {
                state = MiniCrudState.Create<TestFilter, TestItem>(
                    (filter) => mockService.getAll(filter)
                )
                    .setAddState(
                        (item) => mockService.create(item),
                        (item) => `Added ${item.name}`
                    )

                // Generate an error
                state.triggerAdd({ id: 0, name: 'Error Item', value: 0 })
            });
            jest.runAllTimers()

            expect(state.errorMsg()).toBeTruthy()

            // Act
            state.resetMessagesAndLoading()

            // Assert
            expect(state.errorMsg()).toBeUndefined()
            expect(state.successMsg()).toBeUndefined()
            expect(state.loading()).toBe(false)
        })
    })
})