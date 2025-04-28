import { TestBed } from '@angular/core/testing';
import { isPlatformBrowser } from '@angular/common';
import { PerformanceService } from './performance.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

describe('PerformanceService', () => {
  let service: PerformanceService;
  let routerMock: Partial<Router>;
  let routerEventsSubject: Subject<NavigationEnd>;
  const mockIsPlatformBrowser = isPlatformBrowser as jest.Mock;
  
  // Mock global window objects for PerformanceObserver
  const originalWindow = { ...window };
  const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
    observe: jest.fn(),
    disconnect: jest.fn()
  }));
  
  beforeEach(() => {
    // Set up router mock with observable events
    routerEventsSubject = new Subject<NavigationEnd>();
    routerMock = {
      events: routerEventsSubject.asObservable()
    };
    
    // Mock window performance APIs
    // @ts-ignore - intentionally redefining read-only property for testing
    window.performance = {
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByType: jest.fn().mockReturnValue([])
    };
    
    // @ts-ignore - intentionally redefining read-only property for testing
    window.PerformanceObserver = mockPerformanceObserver;
    
    TestBed.configureTestingModule({
      providers: [
        PerformanceService,
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' } // Simulate browser environment
      ]
    });
    
    service = TestBed.inject(PerformanceService);
    
    // Reset mock calls for each test
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // Restore original window objects after all tests
    window.performance = originalWindow.performance;
    // @ts-ignore - restore
    window.PerformanceObserver = originalWindow.PerformanceObserver;
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should measure Core Web Vitals on navigation', () => {
    // Spy on service method
    const measureVitalsSpy = jest.spyOn(service as any, 'measureCoreWebVitals');
    
    // Trigger a navigation event
    routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));
    
    // Verify method was called
    expect(measureVitalsSpy).toHaveBeenCalled();
  });
  
  describe('measureCoreWebVitals', () => {
    it('should create PerformanceObserver for LCP', () => {
      service['measureCoreWebVitals']();
      
      // Verify PerformanceObserver was created with 'largest-contentful-paint'
      expect(mockPerformanceObserver).toHaveBeenCalled();
      expect(mockPerformanceObserver.mock.calls[0][0]).toBeDefined(); // callback function
      
      const observeMethod = mockPerformanceObserver.mock.results[0].value.observe;
      expect(observeMethod).toHaveBeenCalledWith({ 
        type: 'largest-contentful-paint', 
        buffered: true 
      });
    });
    
    it('should create PerformanceObserver for FID', () => {
      service['measureCoreWebVitals']();
      
      // Find the FID observer call (usually second call)
      const observeCalls = mockPerformanceObserver.mock.results
        .map(result => result.value.observe.mock.calls)
        .flat();
      
      const fidObserveCall = observeCalls.find(call => call[0].type === 'first-input');
      
      expect(fidObserveCall).toBeDefined();
      expect(fidObserveCall[0]).toEqual({ 
        type: 'first-input', 
        buffered: true 
      });
    });
    
    it('should create PerformanceObserver for CLS', () => {
      service['measureCoreWebVitals']();
      
      // Find the CLS observer call (usually third call)
      const observeCalls = mockPerformanceObserver.mock.results
        .map(result => result.value.observe.mock.calls)
        .flat();
      
      const clsObserveCall = observeCalls.find(call => call[0].type === 'layout-shift');
      
      expect(clsObserveCall).toBeDefined();
      expect(clsObserveCall[0]).toEqual({ 
        type: 'layout-shift', 
        buffered: true 
      });
    });
    
    it('should handle exceptions when metrics are not supported', () => {
      // Make PerformanceObserver throw an error
      mockPerformanceObserver.mockImplementationOnce(() => {
        throw new Error('Not supported');
      });
      
      // This should not throw
      expect(() => {
        service['measureCoreWebVitals']();
      }).not.toThrow();
    });
  });
  
  describe('type guards', () => {
    it('should correctly identify PerformanceEventTiming entries', () => {
      const regularEntry = { name: 'test', startTime: 0, duration: 0, entryType: 'mark' };
      const timingEntry = { 
        name: 'test', 
        startTime: 0, 
        duration: 0, 
        entryType: 'first-input',
        processingStart: 100,
        processingEnd: 150
      };
      
      expect(service['isPerformanceEventTiming'](regularEntry as PerformanceEntry)).toBe(false);
      expect(service['isPerformanceEventTiming'](timingEntry as unknown as PerformanceEntry)).toBe(true);
    });
    
    it('should correctly identify LayoutShiftEntry entries', () => {
      const regularEntry = { name: 'test', startTime: 0, duration: 0, entryType: 'mark' };
      const layoutShiftEntry = { 
        name: 'test', 
        startTime: 0, 
        duration: 0, 
        entryType: 'layout-shift',
        hadRecentInput: false,
        value: 0.05,
        toJSON: () => ({}) // Add the missing method
      };
      
      expect(service['isLayoutShiftEntry'](regularEntry as PerformanceEntry)).toBe(false);
      expect(service['isLayoutShiftEntry'](layoutShiftEntry as unknown as PerformanceEntry)).toBe(true);
    });
  });
  
  describe('platform detection', () => {
    it('should only run in browser environments', () => {
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          PerformanceService,
          { provide: Router, useValue: routerMock },
          { provide: PLATFORM_ID, useValue: 'server' } // Simulate server environment
        ]
      });
      
      mockIsPlatformBrowser.mockReturnValue(false);
      const serverService = TestBed.inject(PerformanceService);
      const measureVitalsSpy = jest.spyOn(serverService as any, 'measureCoreWebVitals');
      
      // Trigger a navigation event
      routerEventsSubject.next(new NavigationEnd(1, 'test', 'test'));
      
      // Method should still be called due to subscription
      expect(measureVitalsSpy).toHaveBeenCalled();
      
      // But it should exit early and not create PerformanceObservers
      expect(mockPerformanceObserver).not.toHaveBeenCalled();
    });
  });
});