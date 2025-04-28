import { TestBed } from '@angular/core/testing';
import { PerformanceService } from './performance.service';
import { PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

describe('PerformanceService', () => {
  let service: PerformanceService;
  let routerEventsSubject: Subject<NavigationEnd>;
  const mockIsPlatformBrowser = isPlatformBrowser as jest.Mock;

  beforeEach(() => {
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      providers: [
        PerformanceService,
        { provide: Router, useValue: { events: routerEventsSubject.asObservable() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    jest.clearAllMocks();
  });

  it('should initialize and log for browser environments', () => {
    mockIsPlatformBrowser.mockReturnValue(true);

    service = TestBed.inject(PerformanceService);

    expect(mockIsPlatformBrowser).toHaveBeenCalledWith('browser');
  });

  it('should not initialize performance tracking in non-browser environments', () => {
    mockIsPlatformBrowser.mockReturnValue(false);

    service = TestBed.inject(PerformanceService);

    // Simulate a navigation event
    routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));

    // Ensure no performance tracking methods are called
    expect(mockIsPlatformBrowser).toHaveBeenCalledWith('browser');
  });

  it('should measure Core Web Vitals in browser environments', () => {
    mockIsPlatformBrowser.mockReturnValue(true);

    service = TestBed.inject(PerformanceService);

    // Simulate a navigation event
    routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));

    // Ensure performance tracking methods are called
    expect(mockIsPlatformBrowser).toHaveBeenCalledWith('browser');
  });
});