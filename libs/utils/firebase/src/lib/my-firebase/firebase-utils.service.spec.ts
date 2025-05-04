import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
// Import logEvent function to use in assertion
import { Analytics, logEvent } from '@angular/fire/analytics';
import { FirebaseUtilsService } from './firebase-utils.service';
// Import getApp to assert its mock call if needed
import { getApp } from '@firebase/app';

// --- Mock @firebase/app ---
jest.mock('@firebase/app', () => {
  const originalModule = jest.requireActual('@firebase/app');
  return {
    __esModule: true,
    ...originalModule,
    getApp: jest.fn(() => ({
      name: '[DEFAULT]',
      options: {},
    })),
  };
});

// --- Mock @angular/fire/analytics ---
// Mock the specific logEvent function from this module
jest.mock('@angular/fire/analytics', () => {
  const original = jest.requireActual('@angular/fire/analytics');
  return {
    ...original, // Keep other exports like the Analytics token
    logEvent: jest.fn(), // Mock the logEvent function
  };
});


describe('MyFirebaseService', () => {
  let service: FirebaseUtilsService;
  let analyticsInstance: Analytics; // To get the injected instance

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirebaseUtilsService,
        // Provide the *real* Analytics token, AngularFire will handle its creation internally
        // but our mock above intercepts the actual 'logEvent' function call.
        // We still need *something* for the injection to work. A minimal mock is okay here too.
        { provide: Analytics, useValue: { /* a minimal object */ } },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(FirebaseUtilsService);
    analyticsInstance = TestBed.inject(Analytics); // Get the injected (mocked) instance

    // Clear mocks before each test
    (logEvent as jest.Mock).mockClear();
    // (getApp as jest.Mock).mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    // Check if getApp was called because platform is browser
    expect(getApp).toHaveBeenCalled();
    expect(getApp).toHaveBeenCalledTimes(1); // More specific assertion
  });

  it('should call the mocked logEvent function', () => {
    const eventName = 'test_event';
    const eventParams = { data: 'test' };
    service.logEvent(eventName, eventParams);

    // Check if the mocked logEvent function was called correctly
    // It receives the injected Analytics instance, event name, and params
    expect(logEvent).toHaveBeenCalledWith(analyticsInstance, eventName, eventParams);
    expect(logEvent).toHaveBeenCalledTimes(1);
  });

});