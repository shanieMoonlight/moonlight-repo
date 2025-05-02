import { ChangeDetectionStrategy, computed, Signal, signal } from '@angular/core';
import { MiniStateBuilder, MiniState } from '@spider-baby/mini-state';
import { MainConstants } from '../../config/constants';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// Import computed AND WritableSignal
import { NO_ERRORS_SCHEMA, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { MainDemoSimpleComponent } from './simple.component';
// Assuming this path is correct - double-check if error persists
import { Album } from '../../data/album';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// Define Input/Output/Error types for MiniState
type StateInput = void;
type StateOutput = Album[];
type StateError = string; // Or HttpErrorResponse, unknown, etc. based on actual errors

// Mock the MiniStateBuilder and its result with correct generic types
// Use WritableSignal for mocks that need to be set
const mockState: {
  data: WritableSignal<StateOutput | null>;
  loading: WritableSignal<boolean>;
  errorMsg: WritableSignal<string | undefined>;
  successMsg: WritableSignal<string | undefined>;
  trigger: jest.Mock;
  // reset: jest.fn(), // Removed reset as it's likely not part of MiniState type
  update: jest.Mock;
  patch: jest.Mock;
} = {
  data: signal<StateOutput | null>(null),
  loading: signal<boolean>(false),
  errorMsg: signal<string | undefined>(undefined),
  successMsg: signal<string | undefined>(undefined), // Success message is often just string
  trigger: jest.fn(),
  // reset: jest.fn(), // Removed reset
  update: jest.fn(),
  patch: jest.fn(),
};

// Keep a reference to allow modification in tests with correct generic types
// Type assertion needed because mockState is Partial initially
let currentMockState: typeof mockState; 

jest.mock('@spider-baby/mini-state', () => ({
  MiniStateBuilder: {
    Create: jest.fn().mockImplementation(() => ({
      trigger: jest.fn().mockImplementation(() => {
        // Return the current mock state when trigger is called with correct generic types
        // Cast needed as the builder returns the actual MiniState type
        return currentMockState as unknown as MiniState<StateInput, StateOutput, StateError>; 
      })
    }))
  }
}));

describe('MainDemoSimpleComponent', () => {
  let component: MainDemoSimpleComponent;
  let fixture: ComponentFixture<MainDemoSimpleComponent>;
  let mockIoService: Partial<DummyAlbumIoService>;

  const mockAlbums: Album[] = [
    { id: 1, userId: 1, title: 'Album 1' },
    { id: 2, userId: 1, title: 'Album 2' },
  ];

  beforeEach(async () => {
    // Reset the mock state for each test with correct generic types
    // Create fresh signals for each test run
    currentMockState = {
        data: signal<StateOutput | null>(null),
        loading: signal<boolean>(false),
        errorMsg: signal<string | undefined>(undefined),
        successMsg: signal<string | undefined>(undefined),
        trigger: jest.fn(),
        update: jest.fn(),
        patch: jest.fn(),
    };
    // Reset mocks
    (MiniStateBuilder.Create as jest.Mock).mockClear();
    // No need to clear trigger on currentMockState here, it's new


    mockIoService = {
      getAll: jest.fn().mockReturnValue(of(mockAlbums)), // Default success
    };

    await TestBed.configureTestingModule({
      imports: [MainDemoSimpleComponent], // Import standalone component
      providers: [
        { provide: DummyAlbumIoService, useValue: mockIoService },
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            // Provide loaders - Jest might handle dynamic imports,
            // but mocking might be needed if it causes issues.
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            lineNumbers: true, // Or false if not needed for test
            languages: {
              typescript: () => import('highlight.js/lib/languages/typescript'),
              xml: () => import('highlight.js/lib/languages/xml'),
              html: () => import('highlight.js/lib/languages/xml'),
              scss: () => import('highlight.js/lib/languages/scss'),
              // Add other languages used by the component if necessary
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements like child components
    })
    .overrideComponent(MainDemoSimpleComponent, {
        set: { changeDetection: ChangeDetectionStrategy.OnPush }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDemoSimpleComponent);
    component = fixture.componentInstance;

    // Manually assign the mocked state after component creation, using string indexing
    // Cast needed as component expects actual MiniState type
    component['_state'] = currentMockState as unknown as MiniState<StateInput, StateOutput, StateError>; 
    // Use computed import here
    component['_data'] = computed(() => currentMockState.data() ?? []); 
    component['_successMsg'] = currentMockState.successMsg;
    component['_errorMsg'] = currentMockState.errorMsg;
    component['_loading'] = currentMockState.loading;


    currentMockState.loading.set(true); 
    fixture.detectChanges(); 
  });

  // ... (rest of the tests remain the same, using string indexing for protected access) ...

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize MiniStateBuilder correctly', () => {
    expect(MiniStateBuilder.Create).toHaveBeenCalledWith(expect.any(Function));
    // The trigger mock on the *builder* is called once during init
    // Accessing the trigger mock on the *returned state* might be 0 if not called after init
    expect((MiniStateBuilder.Create as jest.Mock).mock.results[0].value.trigger).toHaveBeenCalledTimes(1); 
  });

  it('should set initial values', () => {
    // Use string indexing for protected members
    expect(component['_failureRate']()).toBe(MainConstants.API_FAILURE_RATE * 100);
    expect(component['_displayColumns']()).toEqual(['id', 'userId', 'title']);
    expect(component['_tsCode']()).toBeDefined();
    expect(component['_htmlCode']()).toBeDefined();
  });

  it('should load data successfully on init', fakeAsync(() => {
    // Simulate state after initial trigger completes successfully
    currentMockState.loading.set(false);
    currentMockState.data.set(mockAlbums);
    currentMockState.successMsg.set('Data loaded successfully'); 
    tick(); 
    fixture.detectChanges();
    console.log(component['_errorMsg']());
    

    // Use string indexing for protected members
    expect(component['_loading']()).toBe(false);
    expect(component['_data']()).toEqual(mockAlbums);
    expect(component['_errorMsg']()).toBeUndefined();
    expect(component['_successMsg']()).toBe('Data loaded successfully');
  }));

  it('should handle error on init', fakeAsync(() => {
     // Simulate state after initial trigger completes with error
    currentMockState.loading.set(false);
    currentMockState.data.set(null); 
    currentMockState.errorMsg.set('Failed to load data');
    tick(); 
    fixture.detectChanges();

    // Use string indexing for protected members
    expect(component['_loading']()).toBe(false);
    expect(component['_data']()).toEqual([]); 
    expect(component['_errorMsg']()).toBe('Failed to load data');
    expect(component['_successMsg']()).toBeUndefined();
  }));

  it('should call state.trigger on refresh()', () => {
    // Reset the trigger mock count after initialization
    (currentMockState.trigger as jest.Mock).mockClear();

    // Use string indexing for protected method
    component['refresh'](); 
    fixture.detectChanges();

    expect(currentMockState.trigger).toHaveBeenCalledTimes(1);
  });

  it('should update data on successful refresh', fakeAsync(() => {
    // Set initial state before refresh
    currentMockState.data.set([]);
    currentMockState.loading.set(false);
    tick();
    fixture.detectChanges();

    // Use string indexing for protected method
    component['refresh'](); 
    // Simulate loading start after refresh trigger
    currentMockState.loading.set(true);
    tick();
    fixture.detectChanges();
    // Use string indexing for protected members
    expect(component['_loading']()).toBe(true);

    // Simulate successful refresh completion
    const refreshedAlbums = [...mockAlbums, { id: 3, userId: 2, title: 'Album 3' }];
    currentMockState.loading.set(false);
    currentMockState.data.set(refreshedAlbums);
    currentMockState.successMsg.set('Refreshed');
    currentMockState.errorMsg.set(undefined);
    tick();
    fixture.detectChanges();

    // Use string indexing for protected members
    expect(component['_loading']()).toBe(false);
    expect(component['_data']()).toEqual(refreshedAlbums);
    expect(component['_successMsg']()).toBe('Refreshed');
    expect(component['_errorMsg']()).toBeUndefined();
  }));

    it('should handle error on refresh', fakeAsync(() => {
    // Set initial state before refresh
    currentMockState.data.set(mockAlbums);
    currentMockState.loading.set(false);
    tick();
    fixture.detectChanges();

    // Use string indexing for protected method
    component['refresh'](); 
    // Simulate loading start after refresh trigger
    currentMockState.loading.set(true);
    tick();
    fixture.detectChanges();
    // Use string indexing for protected members
    expect(component['_loading']()).toBe(true);

    // Simulate error on refresh completion
    currentMockState.loading.set(false);
    currentMockState.data.set(null); 
    currentMockState.errorMsg.set('Refresh failed');
    currentMockState.successMsg.set(undefined);
    tick();
    fixture.detectChanges();

    // Use string indexing for protected members
    expect(component['_loading']()).toBe(false);
    expect(component['_data']()).toEqual([]);
    expect(component['_errorMsg']()).toBe('Refresh failed');
    expect(component['_successMsg']()).toBeUndefined();
  }));
});