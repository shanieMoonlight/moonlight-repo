import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA, WritableSignal, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, Router, convertToParamMap } from '@angular/router';
import { MiniStateBuilder, MiniStateCombined } from '@spider-baby/mini-state';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { Album } from '../../data/album';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { MainDemoDetailComponent } from './detail.component';

// Define Input/Output/Error types for MiniState
type ItemStateInput = string; // ID from route
type ItemStateOutput = Album|undefined;
type EditStateInput = Album;
type EditStateOutput = Album; // Assuming update returns the updated album
type StateError = string; // Or HttpErrorResponse, unknown, etc.

// --- Mock MiniState Interfaces (adjust based on actual MiniState types) ---
interface MockMiniState<Input, Output, TError> {
  data: WritableSignal<Output | null>;
  loading: WritableSignal<boolean>;
  errorMsg: WritableSignal<string | undefined>;
  successMsg: WritableSignal<string | undefined>;
  trigger: jest.Mock<any, [Input?]>;
  retrigger?: jest.Mock<any, []>;
  // --- Add chainable methods to the mock interface ---
  setSuccessMsgFn: jest.Mock<MockMiniState<Input, Output, TError>, [(input: Input, output: Output) => string]>;
  setOnSuccessFn: jest.Mock<MockMiniState<Input, Output, TError>, [(input: Input, output: Output) => void]>;
  setOnErrorFn: jest.Mock<MockMiniState<Input, Output, TError>, [(input: Input, error: TError) => void]>;
  setErrorMsgFn: jest.Mock<MockMiniState<Input, Output, TError>, [(error: TError) => string]>;
  setSuccessDataProcessorFn: jest.Mock<MockMiniState<Input, Output, TError>, [(input: Input, output: Output, prevInput: Input | undefined, prevOutput: Output | undefined) => Output | undefined]>;
  setOnTriggerFn: jest.Mock<MockMiniState<Input, Output, TError>, [(t: Input) => void]>;
  // Add other methods if needed by the component
}

// --- Declare Module-Level Variables ---
// These will be assigned in beforeEach *after* component creation
let mockItemState: MockMiniState<ItemStateInput, ItemStateOutput, StateError>;
let mockEditState: MockMiniState<EditStateInput, EditStateOutput, StateError>;
let mockCombinedState: {
    data: WritableSignal<ItemStateOutput | EditStateOutput | null>;
    loading: WritableSignal<boolean>;
    errorMsg: WritableSignal<StateError | undefined>;
    successMsg: WritableSignal<string | undefined>;
};

// --- Helper function to create mock state with chainable methods ---
function createMockState<Input, Output, TError>(): MockMiniState<Input, Output, TError> {
    const state: Partial<MockMiniState<Input, Output, TError>> = {
        data: signal<Output | null>(null),
        loading: signal<boolean>(false),
        errorMsg: signal<string | undefined>(undefined),
        successMsg: signal<string | undefined>(undefined),
        trigger: jest.fn(),
        retrigger: jest.fn(),
    };
    // Add chainable methods that return the state object itself
    state.setSuccessMsgFn = jest.fn().mockReturnValue(state);
    state.setOnSuccessFn = jest.fn().mockReturnValue(state);
    state.setOnErrorFn = jest.fn().mockReturnValue(state);
    state.setErrorMsgFn = jest.fn().mockReturnValue(state);
    state.setSuccessDataProcessorFn = jest.fn().mockReturnValue(state);
    state.setOnTriggerFn = jest.fn().mockReturnValue(state);

    return state as MockMiniState<Input, Output, TError>;
}

// --- Mock MiniStateBuilder ---
// The factory now just returns the mocked structure
jest.mock('@spider-baby/mini-state', () => {
    const itemStateInstance = createMockState<ItemStateInput, ItemStateOutput, StateError>();
    const editStateInstance = createMockState<EditStateInput, EditStateOutput, StateError>();
    return {
        MiniStateBuilder: {
            CreateWithObservableInput: jest.fn().mockImplementation(() => itemStateInstance),
            CreateWithInput: jest.fn().mockImplementation(() => editStateInstance),
        }
    };
});

// --- Mock MiniStateCombined ---
// Simplify the Combine mock - just return the combined state mock object
jest.mock('@spider-baby/mini-state/utils', () => ({
    MiniStateCombined: {
        Combine: jest.fn().mockImplementation(() => mockCombinedState)
    }
}));

describe('MainDemoDetailComponent', () => {
  let component: MainDemoDetailComponent;
  let fixture: ComponentFixture<MainDemoDetailComponent>;
  let mockIoService: Partial<DummyAlbumIoService>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let paramMapSubject: Subject<ParamMap>;

  const initialAlbumId = '1';
  const mockAlbum: Album = { id: 1, userId: 1, title: 'Test Album 1' };
  const updatedAlbum: Album = { id: 1, userId: 1, title: 'Updated Test Album 1' };

  // Separate async setup for TestBed configuration
  beforeEach(async () => {
    // --- Reset Combined State Signals ---
    mockCombinedState = {
        data: signal<ItemStateOutput | EditStateOutput | null>(null),
        loading: signal<boolean>(false),
        errorMsg: signal<string | undefined>(undefined),
        successMsg: signal<string | undefined>(undefined),
    };

    // --- Mock Services ---
    mockIoService = {
      getById: jest.fn().mockReturnValue(of(mockAlbum)),
      update: jest.fn().mockReturnValue(of(updatedAlbum)),
    };
    mockRouter = { navigate: jest.fn() };
    paramMapSubject = new BehaviorSubject<ParamMap>(convertToParamMap({ id: initialAlbumId }));
    mockActivatedRoute = { paramMap: paramMapSubject.asObservable() };

    // --- TestBed Configuration ---
    await TestBed.configureTestingModule({
      imports: [MainDemoDetailComponent],
      providers: [
        { provide: DummyAlbumIoService, useValue: mockIoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            lineNumbers: true,
            languages: {
              typescript: () => import('highlight.js/lib/languages/typescript'),
              xml: () => import('highlight.js/lib/languages/xml'),
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(MainDemoDetailComponent, {
        set: { changeDetection: ChangeDetectionStrategy.OnPush }
    })
    .compileComponents();
  });

  // Use fakeAsync for component creation and initial tick
  beforeEach(fakeAsync(() => {
    // Clear builder/combiner mocks BEFORE component creation
    (MiniStateBuilder.CreateWithObservableInput as jest.Mock).mockClear();
    (MiniStateBuilder.CreateWithInput as jest.Mock).mockClear();
    (MiniStateCombined.Combine as jest.Mock).mockClear();

    // Create Component (this triggers constructor and builder mocks)
    fixture = TestBed.createComponent(MainDemoDetailComponent);
    component = fixture.componentInstance;

    // Assign Mock Instances AFTER Component Creation
    mockItemState = (MiniStateBuilder.CreateWithObservableInput as jest.Mock).mock.results[0].value;
    mockEditState = (MiniStateBuilder.CreateWithInput as jest.Mock).mock.results[0].value;

    // Reset Internal State of Mocks (Signals/Functions)
    mockItemState.data.set(null);
    mockItemState.loading.set(false);
    mockItemState.errorMsg.set(undefined);
    mockItemState.successMsg.set(undefined);

    mockEditState.data.set(null);
    mockEditState.loading.set(false);
    mockEditState.errorMsg.set(undefined);
    mockEditState.successMsg.set(undefined);

    // Assign Combined State and Derived Signals
    component['_state'] = mockCombinedState as any;
    component['_album'] = computed(() => mockCombinedState.data() ?? undefined);
    component['_successMsg'] = mockCombinedState.successMsg;
    component['_errorMsg'] = mockCombinedState.errorMsg;
    component['_loading'] = mockCombinedState.loading;

    // Initial Detect Changes and Tick (inside fakeAsync)
    fixture.detectChanges(); // Run initial change detection
    tick(); // Flush async operations like paramMap subscription
    fixture.detectChanges(); // Detect changes resulting from flushed operations
  }));

  // --- Tests ---
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockEditState.setSuccessMsgFn).toHaveBeenCalledTimes(1);
  });

  it('should initialize MiniState builders and combiner correctly', () => {
    expect(MiniStateBuilder.CreateWithObservableInput).toHaveBeenCalledTimes(1);
    expect(MiniStateBuilder.CreateWithInput).toHaveBeenCalledTimes(1);
    expect(MiniStateCombined.Combine).toHaveBeenCalledTimes(1);
  });

  it('should load item data when route param emits', fakeAsync(() => {
    // Simulate the state changes triggered by the initial route param emission
    mockCombinedState.loading.set(true); // Combined loading starts
    tick();
    fixture.detectChanges();
    expect(component['_loading']()).toBe(true);

    // Simulate item state success
    mockItemState.data.set(mockAlbum);
    mockItemState.loading.set(false);
    // Simulate combined state reflecting item state success
    mockCombinedState.data.set(mockAlbum);
    mockCombinedState.loading.set(false);
    mockCombinedState.successMsg.set(undefined); // No specific success msg on initial load usually
    mockCombinedState.errorMsg.set(undefined);
    tick();
    fixture.detectChanges();

    expect(component['_loading']()).toBe(false);
    expect(component['_album']()).toEqual(mockAlbum);
    expect(component['_errorMsg']()).toBeUndefined();
    expect(component['_successMsg']()).toBeUndefined();
  }));

   it('should handle error when loading item data', fakeAsync(() => {
    // Simulate loading start
    mockCombinedState.loading.set(true);
    tick();
    fixture.detectChanges();

    // Simulate item state error
    mockItemState.data.set(null);
    mockItemState.loading.set(false);
    mockItemState.errorMsg.set('Item Load Failed');
    // Simulate combined state reflecting item state error
    mockCombinedState.data.set(null); // Or keep previous data based on combine logic
    mockCombinedState.loading.set(false);
    mockCombinedState.errorMsg.set('Item Load Failed');
    mockCombinedState.successMsg.set(undefined);
    tick();
    fixture.detectChanges();

    expect(component['_loading']()).toBe(false);
    expect(component['_album']()).toBeUndefined(); // Default from computed
    expect(component['_errorMsg']()).toBe('Item Load Failed');
    expect(component['_successMsg']()).toBeUndefined();
  }));

  it('should call _itemState.retrigger on refresh()', () => {
    component['refresh']();
    expect(mockItemState.retrigger).toHaveBeenCalledTimes(1);
  });

  it('should call _editState.trigger on edit()', () => {
    component['edit'](updatedAlbum);
    expect(mockEditState.trigger).toHaveBeenCalledTimes(1);
    expect(mockEditState.trigger).toHaveBeenCalledWith({ ...updatedAlbum, title: `${updatedAlbum.title} (Updated)!!` });
  });

  it('should update data on successful edit', fakeAsync(() => {
    // Set initial loaded state
    mockCombinedState.data.set(mockAlbum);
    mockCombinedState.loading.set(false);
    tick();
    fixture.detectChanges();

    // Trigger edit
    component['edit'](updatedAlbum);

    // Simulate edit state loading
    mockEditState.loading.set(true);
    // Simulate combined state reflecting edit loading
    mockCombinedState.loading.set(true);
    tick();
    fixture.detectChanges();
    expect(component['_loading']()).toBe(true);

    // Simulate edit state success
    mockEditState.data.set(updatedAlbum);
    mockEditState.loading.set(false);
    mockEditState.successMsg.set(`Album ${updatedAlbum.title} updated successfully!`);
    // Simulate combined state reflecting edit success
    mockCombinedState.data.set(updatedAlbum); // Combined data updates
    mockCombinedState.loading.set(false);
    mockCombinedState.successMsg.set(`Album ${updatedAlbum.title} updated successfully!`);
    mockCombinedState.errorMsg.set(undefined);
    tick();
    fixture.detectChanges();

    expect(component['_loading']()).toBe(false);
    expect(component['_album']()).toEqual(updatedAlbum); // Check combined data
    expect(component['_successMsg']()).toBe(`Album ${updatedAlbum.title} updated successfully!`);
    expect(component['_errorMsg']()).toBeUndefined();
  }));

  it('should handle error on edit', fakeAsync(() => {
     // Set initial loaded state
    mockCombinedState.data.set(mockAlbum);
    mockCombinedState.loading.set(false);
    tick();
    fixture.detectChanges();

    // Trigger edit
    component['edit'](updatedAlbum);

    // Simulate edit state loading
    mockEditState.loading.set(true);
    mockCombinedState.loading.set(true);
    tick();
    fixture.detectChanges();

    // Simulate edit state error
    mockEditState.data.set(null); // Or keep old data
    mockEditState.loading.set(false);
    mockEditState.errorMsg.set('Update Failed');
    // Simulate combined state reflecting edit error
    mockCombinedState.data.set(mockAlbum); // Keep previous data
    mockCombinedState.loading.set(false);
    mockCombinedState.errorMsg.set('Update Failed');
    mockCombinedState.successMsg.set(undefined);
    tick();
    fixture.detectChanges();

    expect(component['_loading']()).toBe(false);
    expect(component['_album']()).toEqual(mockAlbum); // Check combined data (previous)
    expect(component['_errorMsg']()).toBe('Update Failed');
    expect(component['_successMsg']()).toBeUndefined();
  }));

  it('should navigate on randomize()', () => {
    component['randomize']();
    // Check if router.navigate was called
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    // Check the path structure (first arg is array, second is options)
    expect(mockRouter.navigate).toHaveBeenCalledWith(
        expect.arrayContaining(['../', expect.any(Number)]), // Path segments
        expect.objectContaining({ relativeTo: mockActivatedRoute }) // Options
    );
  });

});