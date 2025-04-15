// import { TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { DOCUMENT } from '@angular/common';
// import { RendererFactory2, Renderer2, DestroyRef } from '@angular/core';
// // import { SsrLocalStorage } from '@moonlight/ssr-storage';
// // import { ThemeConfig, ThemeConfigService, ThemeOption } from '@moonlight/ng/theming/config';
// import { ThemeData, ThemeDataUtils, ThemeSuffix } from './theme-data';
// import { SsrLocalStorage } from '../../../../ssr/storage/src/lib/ssr-local-storage.service';
// import { ThemeConfig, ThemeConfigService, ThemeMode } from '../../../config/src/lib/theme-picker-menu-config';
// import { ThemeOption } from '../../../config/src/lib/theme-option.model';
// import { firstValueFrom } from 'rxjs';
// import { ThemeService } from './theme.service';

// // Mock implementations
// class MockRenderer {
//   addClass = jest.fn();
//   removeClass = jest.fn();
// }

// class MockRendererFactory {
//   createRenderer = jest.fn().mockReturnValue(new MockRenderer());
// }

// class MockSsrLocalStorage {
//   getItemObject = jest.fn();
//   setItemObject = jest.fn();
// }

// class MockDestroyRef {
//   onDestroy = jest.fn().mockReturnValue({ subscribe: jest.fn() }); // Basic mock for takeUntilDestroyed
// }

// const THEME_KEY = 'moonlight_theme_key';

// describe('ThemeService', () => {
//   let service: ThemeService;
//   let document: Document;
//   let renderer: MockRenderer;
//   let rendererFactory: MockRendererFactory;
//   let localStorage: MockSsrLocalStorage;
//   let themeConfig: ThemeConfig;

//   const defaultLightClass = 'mode-light';
//   const defaultDarkClass = 'mode-dark';
//   const defaultThemePrefix = 'theme';
//   const defaultMode: ThemeMode = 'light'
//   const defaultThemeOptions: ThemeOption[] = [
//     { label: 'Default', classSuffix: 0 },
//     { label: 'Blue', classSuffix: 1 },
//     { label: 'Green', classSuffix: 2 },
//   ];

//   const configureTestBed = (config: Partial<ThemeConfig> = {}, initialLocalStorageData: ThemeData | null = null) => {
//     themeConfig = ThemeConfig.Create(
//       defaultThemeOptions,
//       defaultDarkClass,
//       defaultLightClass,
//       defaultThemePrefix,
//       defaultMode
//     );

//     localStorage = new MockSsrLocalStorage();
//     localStorage.getItemObject.mockReturnValue(initialLocalStorageData);
//     rendererFactory = new MockRendererFactory();
//     renderer = rendererFactory.createRenderer() as unknown as MockRenderer; // Get the instance

//     TestBed.configureTestingModule({
//       providers: [
//         ThemeService,
//         { provide: DOCUMENT, useValue: { body: {} } }, // Provide a mock body
//         { provide: RendererFactory2, useValue: rendererFactory },
//         { provide: SsrLocalStorage, useValue: localStorage },
//         { provide: ThemeConfigService, useValue: themeConfig },
//         { provide: DestroyRef, useClass: MockDestroyRef },
//       ],
//     });

//     // Mock matchMedia before service instantiation
//     Object.defineProperty(window, 'matchMedia', {
//       writable: true,
//       value: jest.fn().mockImplementation(query => ({
//         matches: query === '(prefers-color-scheme: dark)', // Default to system dark mode for this mock setup
//         media: query,
//         onchange: null,
//         addListener: jest.fn(), // Deprecated
//         removeListener: jest.fn(), // Deprecated
//         addEventListener: jest.fn(),
//         removeEventListener: jest.fn(),
//         dispatchEvent: jest.fn(),
//       })),
//     });


//     service = TestBed.inject(ThemeService);
//     document = TestBed.inject(DOCUMENT); // Inject the mock document
//   };

//   beforeEach(() => {
//     // Reset mocks before each test
//     jest.clearAllMocks();
//   });

//   describe('Initialization', () => {
//     it('should initialize with default light theme if no storage and system prefers light', () => {
//       Object.defineProperty(window, 'matchMedia', {
//         writable: true,
//         value: jest.fn().mockImplementation(query => ({
//           matches: false, // System prefers light
//           // ... other properties
//         })),
//       });
//       configureTestBed({ defaultMode: 'light' });

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, defaultDarkClass);
//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, defaultLightClass); // Initial clear
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultLightClass); // Set light
//       // expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-0`); // Set default theme 0
//       // expect(service.isDarkMode()).toBe(false);
//       // expect(service.themeIdx()).toBe(0);
//     });

//     it('should initialize with default dark theme if no storage and system prefers dark', () => {
//       Object.defineProperty(window, 'matchMedia', {
//         writable: true,
//         value: jest.fn().mockImplementation(query => ({
//           matches: true, // System prefers dark
//           // ... other properties
//         })),
//       });
//       configureTestBed({ defaultMode: 'light' }); // Config default is light, but system overrides

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultDarkClass); // Set dark
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-0`); // Set default theme 0
//       expect(service.isDarkMode()).toBe(true);
//       expect(service.themeIdx()).toBe(0);
//     });

//     it('should initialize with default dark theme from config if no storage and no system preference', () => {
//       Object.defineProperty(window, 'matchMedia', {
//         writable: true,
//         value: jest.fn().mockImplementation(query => ({
//           matches: false, // System prefers light, but config default is dark
//           // ... other properties
//         })),
//       });
//       // Temporarily remove matchMedia to simulate no system preference detection
//       const originalMatchMedia = window.matchMedia;
//       Object.defineProperty(window, 'matchMedia', { value: undefined, writable: true });

//       configureTestBed({ defaultMode: 'dark' });

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultDarkClass); // Set dark from config
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-0`); // Set default theme 0
//       expect(service.isDarkMode()).toBe(true);
//       expect(service.themeIdx()).toBe(0);

//       // Restore matchMedia
//       Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia, writable: true });
//     });

//     it('should initialize from localStorage if data exists', () => {
//       const storedTheme: ThemeData = { isDarkMode: true, suffix: 2 };
//       configureTestBed({}, storedTheme);

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultDarkClass); // Set dark from storage
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-2`); // Set theme 2 from storage
//       expect(service.isDarkMode()).toBe(true);
//       expect(service.themeIdx()).toBe(2);
//     });

//     it('should initialize with default theme if localStorage theme suffix is invalid', () => {
//       const storedTheme: ThemeData = { isDarkMode: false, suffix: 99 as ThemeSuffix }; // Invalid suffix
//       configureTestBed({}, storedTheme);

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultLightClass); // Set light from storage
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-0`); // Set default theme 0
//       expect(service.isDarkMode()).toBe(false);
//       expect(service.themeIdx()).toBe(0);
//     });

//     it('should handle errors during initialization and apply default theme', () => {
//       const errorSpy = jest.spyOn(console, 'error').mockImplementation();
//       localStorage = new MockSsrLocalStorage();
//       localStorage.getItemObject.mockImplementation(() => { throw new Error('Storage Error'); }); // Simulate error
//       rendererFactory = new MockRendererFactory();
//       renderer = rendererFactory.createRenderer() as unknown as MockRenderer;

//       TestBed.configureTestingModule({
//         providers: [
//           ThemeService,
//           { provide: DOCUMENT, useValue: { body: {} } },
//           { provide: RendererFactory2, useValue: rendererFactory },
//           { provide: SsrLocalStorage, useValue: localStorage },
//           { provide: ThemeConfigService, useValue: ThemeConfig.Create() }, // Default dark
//           { provide: DestroyRef, useClass: MockDestroyRef },
//         ],
//       });
//       service = TestBed.inject(ThemeService);

//       expect(errorSpy).toHaveBeenCalledWith('Error initializing theme:', expect.any(Error));
//       // Check if setDefaultTheme was effectively called
//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, defaultDarkClass);
//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, defaultLightClass);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultDarkClass); // Default dark mode applied
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-0`); // Default theme suffix 0 applied
//       expect(service.isDarkMode()).toBe(true);
//       expect(service.themeIdx()).toBe(0);
//       errorSpy.mockRestore();
//     });
//   });

//   describe('setDarkMode', () => {
//     beforeEach(() => {
//       configureTestBed({ defaultMode: 'light' }); // Start in light mode
//     });

//     it('should switch to dark mode', async () => {
//       service.setDarkMode(true);

//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, defaultLightClass);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultDarkClass);
//       expect(service.isDarkMode()).toBe(true);
//       const emittedValue = await firstValueFrom(service.isDarkMode$);
//       expect(emittedValue).toBe(true);
//     });

//     it('should switch to light mode', async () => {
//       // First switch to dark
//       service.setDarkMode(true);
//       jest.clearAllMocks(); // Clear mocks after initial setup

//       // Then switch back to light
//       service.setDarkMode(false);

//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, defaultDarkClass);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, defaultLightClass);
//       expect(service.isDarkMode()).toBe(false);
//       const emittedValue = await firstValueFrom(service.isDarkMode$);
//       expect(emittedValue).toBe(false);
//     });
//   });

//   describe('setThemeSuffix', () => {
//     beforeEach(() => {
//       configureTestBed(); // Initialize with default theme 0
//     });

//     it('should switch theme suffix', async () => {
//       const newSuffix: ThemeSuffix = 1;
//       const initialThemeClass = `${defaultThemePrefix}-0`;
//       const newThemeClass = `${defaultThemePrefix}-${newSuffix}`;

//       service.setThemeSuffix(newSuffix);

//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, initialThemeClass);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, newThemeClass);
//       expect(service.themeIdx()).toBe(newSuffix);
//       const emittedValue = await firstValueFrom(service.themeIdx$);
//       expect(emittedValue).toBe(newSuffix);
//     });

//     it('should switch back to default theme suffix', async () => {
//       // Set to theme 1 first
//       service.setThemeSuffix(1);
//       jest.clearAllMocks(); // Clear mocks

//       // Set back to default (implicitly 0 in this config)
//       service.setThemeSuffix(0);

//       expect(renderer.removeClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-1`);
//       expect(renderer.addClass).toHaveBeenCalledWith(document.body, `${defaultThemePrefix}-0`);
//       expect(service.themeIdx()).toBe(0);
//       const emittedValue = await firstValueFrom(service.themeIdx$);
//       expect(emittedValue).toBe(0);
//     });
//   });

//   describe('Persistence', () => {
//     beforeEach(() => {
//       configureTestBed();
//     });

//     it('should store theme data in localStorage after changes', fakeAsync(() => {
//       service.setDarkMode(true);
//       service.setThemeSuffix(2);

//       // Should not have saved yet due to debounce
//       expect(localStorage.setItemObject).not.toHaveBeenCalled();

//       tick(150); // Advance time past debounceTime(100)

//       const expectedData = ThemeDataUtils.create(2, true);
//       expect(localStorage.setItemObject).toHaveBeenCalledTimes(1); // Called once after debounce
//       expect(localStorage.setItemObject).toHaveBeenCalledWith(THEME_KEY, expectedData);
//     }));

//     it('should only store the latest theme data after multiple rapid changes', fakeAsync(() => {
//       service.setDarkMode(true); // dark, 0
//       tick(50);
//       service.setThemeSuffix(1); // dark, 1
//       tick(50);
//       service.setDarkMode(false); // light, 1
//       tick(50);
//       service.setThemeSuffix(2); // light, 2 - final state

//       // Should not have saved yet
//       expect(localStorage.setItemObject).not.toHaveBeenCalled();

//       tick(150); // Advance time past debounceTime(100) for the last change

//       const expectedData = ThemeDataUtils.create(2, false);
//       expect(localStorage.setItemObject).toHaveBeenCalledTimes(1); // Called only once
//       expect(localStorage.setItemObject).toHaveBeenCalledWith(THEME_KEY, expectedData);
//     }));
//   });

//   describe('retrieveTheme', () => {
//     it('should return parsed theme data from localStorage', () => {
//       const storedData: ThemeData = { isDarkMode: true, suffix: 1 };
//       localStorage = new MockSsrLocalStorage();
//       localStorage.getItemObject.mockReturnValue(storedData);
//       configureTestBed({}, null); // Pass null to avoid re-mocking localStorage inside configure

//       const retrieved = service.retrieveTheme();

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(retrieved).toEqual(storedData);
//     });

//     it('should return null if no theme data in localStorage', () => {
//       localStorage = new MockSsrLocalStorage();
//       localStorage.getItemObject.mockReturnValue(null);
//       configureTestBed({}, null);

//       const retrieved = service.retrieveTheme();

//       expect(localStorage.getItemObject).toHaveBeenCalledWith(THEME_KEY);
//       expect(retrieved).toBeNull();
//     });
//   });

//   describe('detectSystemThemePreference', () => {
//     // Note: This tests the private method indirectly via initialization
//     // or requires making it public/using 'as any' for direct testing.
//     // We tested its effect during initialization tests.

//     it('should return true if window.matchMedia prefers dark', () => {
//       Object.defineProperty(window, 'matchMedia', {
//         writable: true,
//         value: jest.fn().mockImplementation(query => ({
//           matches: query === '(prefers-color-scheme: dark)', // Prefers dark
//           // ... other properties
//         })),
//       });
//       configureTestBed();
//       // Access private method for testing (use with caution)
//       expect((service as any).detectSystemThemePreference()).toBe(true);
//     });

//     it('should return false if window.matchMedia prefers light', () => {
//       Object.defineProperty(window, 'matchMedia', {
//         writable: true,
//         value: jest.fn().mockImplementation(query => ({
//           matches: false, // Prefers light
//           // ... other properties
//         })),
//       });
//       configureTestBed();
//       expect((service as any).detectSystemThemePreference()).toBe(false);
//     });

//     it('should return false if window is undefined', () => {
//       const originalWindow = global.window;
//       // @ts-ignore Simulate SSR environment
//       delete global.window;

//       configureTestBed(); // Re-configure without window

//       expect((service as any).detectSystemThemePreference()).toBe(false);

//       global.window = originalWindow; // Restore window
//     });
//   });

// });