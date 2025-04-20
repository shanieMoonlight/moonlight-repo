import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';
// import 'jest-preset-angular/setup-jest';

console.log('>>> test-setup.ts: Running setup...'); // Check if file runs
// --- Add this section to ignore JSDOM CSS parsing errors ---
// JSDOM adds the virtual console to the window object under _virtualConsole
// Note: This relies on JSDOM's internal structure, which could change, but is a common workaround.
const virtualConsole = (window as any)._virtualConsole;

if (virtualConsole) {
  console.log('>>> test-setup.ts: Virtual console found. Attaching listener.'); // Check if listener attaches
  virtualConsole.on('jsdomError', (error: any) => {
    console.log('>>> test-setup.ts: JSDOM Error Detected:', error.message); // Check if listener fires

    const message = error?.message || '';
    const detail = error?.detail?.message || error?.detail || '';

    if (
      message.includes('Could not parse CSS stylesheet') ||
      detail.includes('Could not parse CSS stylesheet')
    ) {
      console.warn(`>>> test-setup.ts: Suppressed JSDOM CSS Parsing Error: ${message}`); // Check if error is caught
      return; // Suppress
    }
    console.error('>>> test-setup.ts: Unhandled JSDOM Error:', error); // Log other errors
  });
} else {
  console.warn('>>> test-setup.ts: Could not find JSDOM virtual console.');
}


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