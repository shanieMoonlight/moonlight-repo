import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { MainDemoDetailComponent } from './detail.component';
import { DummyAlbumIoService } from '../../io/dummy/dummy-album-io.service';
import { Album } from '../../data/album';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ON_TRIGGER_COMPLETE_DELAY_MS } from '@spider-baby/mini-state';

jest.useFakeTimers();

const triggerCompleteDelay = ON_TRIGGER_COMPLETE_DELAY_MS + 1

describe('MainDemoDetailComponent callbacks (editState)', () => {
  let fixture: ComponentFixture<MainDemoDetailComponent>;
  let comp: MainDemoDetailComponent;
  let ioSubject: Subject<Album>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockIo: Partial<DummyAlbumIoService>;
  let paramMapSubject: Subject<ParamMap>;
  const initialAlbumId = '1';

  beforeEach(async () => {
    ioSubject = new Subject<Album>();
    mockIo = {
      update: jest.fn().mockImplementation((a: Album) => ioSubject.asObservable()),
      getById: jest.fn().mockReturnValue(new Subject().asObservable())
    };
    mockRouter = { navigate: jest.fn() };
    paramMapSubject = new BehaviorSubject<ParamMap>(convertToParamMap({ id: initialAlbumId }));
    mockActivatedRoute = { paramMap: paramMapSubject.asObservable() };

    await TestBed.configureTestingModule({
      imports: [MainDemoDetailComponent],
      providers: [
        { provide: DummyAlbumIoService, useValue: mockIo },
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainDemoDetailComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  function makeAlbum(): Album {
    return { id: '1', title: 'Original Title' } as unknown as Album;
  }

  it('calls onTriggerFn synchronously when edit() triggers the state', () => {
    const album = makeAlbum();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // call component wrapper that triggers the _editState
    comp.edit(album);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('About to trigger edit album'));
    // access private mini-state for additional assertion
    const editState = (comp as any)['_editState'];
    expect(editState.loading()).toBe(true);

    logSpy.mockRestore();
  });




  it('calls onSuccessFn after success emission and 300ms delay', () => {
    const album = makeAlbum();
    const successSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    comp.edit(album);

    // simulate service success response
    const returned = { ...album, title: `${album.title} (Updated)!!` } as Album;
    ioSubject.next(returned);
    ioSubject.complete();

    // not yet called because MiniState defers _onSuccessFn via setTimeout
    expect(successSpy).not.toHaveBeenCalledWith(expect.stringContaining('Success: Album'));

    jest.advanceTimersByTime(triggerCompleteDelay);

    expect(successSpy).toHaveBeenCalledWith(expect.stringContaining('Success: Album'));

    const editState = (comp as any)['_editState'];
    expect(editState.loading()).toBe(false);
    expect(editState.data()).toEqual(expect.objectContaining({ title: expect.stringContaining('(Updated)!!') }));

    successSpy.mockRestore();
  });




  it('calls onErrorFn after error emission and 300ms delay, and surfaces error state', () => {
    const album = makeAlbum();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const testErr = new Error('boom');

    comp.edit(album);

    // simulate service error
    ioSubject.error(testErr);

    // not yet called due to timeout
    expect(errorSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(triggerCompleteDelay);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Something went wrong'), expect.any(Error));

    const editState = (comp as any)['_editState'];
    expect(editState.loading()).toBe(false);
    expect(editState.error()).toBe(testErr);
    expect(editState.errorMsg()).toEqual(expect.stringContaining('boom'));

    errorSpy.mockRestore();
  });
});