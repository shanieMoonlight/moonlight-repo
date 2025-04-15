import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Initialize the Angular testing environment
setupZoneTestEnv();

// Your other test setup code...
import { ngMocks } from 'ng-mocks';

// Initialize ng-mocks (optional but recommended)
ngMocks.autoSpy('jest');

// Global mocks for browser APIs
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, // Default value for tests
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated but sometimes used
    removeListener: jest.fn(), // Deprecated but sometimes used
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});



// Global mocks for browser APIs
Object.defineProperty(window, 'CSS', { value: null });


// Global jest matchers
expect.extend({
  // Add custom matchers here if needed
});

// Mock global browser objects that might be missing in Jest
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));