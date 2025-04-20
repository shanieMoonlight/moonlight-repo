import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing'; // Keep standard imports
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockBuilder, MockRender } from 'ng-mocks'; // Import ng-mocks tools
// --- Your Component & Dependencies ---
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY } from '../../../../../config/src/index';
import {  } from '../../../../../service/src/index';
import { ScssDisplayComponent } from '../../ui/scss-display.component';
import {  fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { ThemeService } from '../ ../../../../../../service/src/index';
import { SsrLocalStorage } from '../../../../../../ssr/storage/src/index';
import { ThemeConfig, ThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption, DarkModeType } from '@moonlight/ng/theming/config';
import { ThemeGeneratorService } from './generator/theme-generator.service';
import { ThemeData, ThemeDataUtils } from './theme-data';
import { take } from 'rxjs/operators'; // Import take operator
// import { ThemeGeneratorService } from '@moonlight/ng/theming/service';
// import { ThemeConfig, ThemeConfigService, ThemeOption } from '@moonlight/ng/theming/config';
// NOTE: No need to import MatDialogModule or MatEverythingModule here

// --- Mock Data & Shared Variables (Keep as before) ---
const mockPresets: ThemeOption[] = [
  ThemeOption.create( { value: 'preset1', label: 'Preset 1', primaryColor: '#111111', secondaryColor: '#aaaaaa', darkMode: false }),
  ThemeOption.create({ value: 'preset2', label: 'Preset 2', primaryColor: '#222222', secondaryColor: '#bbbbbb', darkMode: true }),
];

// --- Test Host Component for Input Testing ---
@Component({
  template: '<ml-theme-selector [presetThemes]="hostPresets"></ml-theme-selector>',
  standalone: true,
  imports: [ThemeSelectorComponent]
})
class TestHostComponent {
  hostPresets: ThemeOption[] | undefined;
}

describe('ThemeSelectorComponent', () => {

  // Let TypeScript infer the type from the assignment in beforeEach
  let themeGeneratorMock: {
      applyTheme: jest.Mock;
      exportThemeAsScss: jest.Mock;
      currentTheme: import('@angular/core').Signal<ThemeOption | null>; // Use Signal type
  };
  let mockThemeConfig: ThemeConfig;

  // --- Setup Mocks (Runs ONCE before any test group) ---
  beforeEach(() => {
    // Mock ThemeGeneratorService
    themeGeneratorMock = {
      applyTheme: jest.fn(),
      exportThemeAsScss: jest.fn().mockReturnValue('// Mock SCSS content'),
      // Mock currentTheme as a simple signal for the test
      currentTheme: signal<ThemeOption | null>(null)
    }; // No type assertion needed here

    // Create Mock ThemeConfigService value
    mockThemeConfig = ThemeConfig.Create();
    mockThemeConfig.presetSelectorThemes = mockPresets;

    // Mock documentElement for applyTheme calls
    // Mocks
    const mockDefaultTheme: ThemeOption = { ...defaultThemeOption, value: 'default-light', label: 'Default Light', darkMode: false };
    const mockDarkTheme: ThemeOption = { value: 'system-dark', label: 'System Dark', darkMode: true, primaryColor: '#000000', secondaryColor: '#ffffff' };
    const mockLightTheme: ThemeOption = { value: 'system-light', label: 'System Light', darkMode: false, primaryColor: '#ffffff', secondaryColor: '#000000' };
    const mockCustomTheme1: ThemeOption = { value: 'custom-blue', label: 'Custom Blue', darkMode: false, primaryColor: '#0000ff', secondaryColor: '#ffffff' };
    const mockCustomTheme2: ThemeOption = { value: 'custom-red', label: 'Custom Red', darkMode: true, primaryColor: '#ff0000', secondaryColor: '#000000' };


    class MockSsrLocalStorage {
      getItemObject = jest.fn();
      setItemObject = jest.fn();
      removeItem = jest.fn();
    }

    class MockSytemPrefsService {
      prefersDarkMode$ = new BehaviorSubject<boolean>(false); // Default to light
    }

    // Use a factory for the InjectionToken mock
    const createMockThemeConfigService = (overrides?: Partial<ThemeConfig>): ThemeConfig => {
        const config = ThemeConfig.Create(); // Use the static Create method
        config.themeOptions = [mockLightTheme, mockDarkTheme];
        config.defaultDarkMode = false;
        // Apply overrides
        if (overrides) {
            Object.assign(config, overrides);
        }
        return config;
    };


    class MockThemeGeneratorService {
      applyTheme = jest.fn();
      exportThemeAsScss = jest.fn(); // Add if needed for other tests
    }

    class MockDestroyRef extends DestroyRef {
      onDestroy = jest.fn();
      constructor() { super(); }
    }

    describe('ThemeService', () => {
      let service: ThemeService;
      let localStorageMock: MockSsrLocalStorage;
      let themeConfigMock: ThemeConfig; // Now holds the actual config object
      let themeGeneratorMock: MockThemeGeneratorService;
      let systemPrefsMock: MockSytemPrefsService;
      let destroyRefMock: MockDestroyRef;

      const setupTestBed = (configOverrides?: Partial<ThemeConfig>, storageData?: ThemeData | null | 'error') => {
        // Create the mock config object using the factory
        themeConfigMock = createMockThemeConfigService(configOverrides);

        TestBed.configureTestingModule({
          providers: [
            ThemeService,
            { provide: SsrLocalStorage, useClass: MockSsrLocalStorage },
            { provide: SytemPrefsService, useClass: MockSytemPrefsService },
            // Provide the mock config object for the InjectionToken
            { provide: ThemeConfigService, useValue: themeConfigMock },
            { provide: ThemeGeneratorService, useClass: MockThemeGeneratorService },
            { provide: DestroyRef, useClass: MockDestroyRef },
          ],
        });

        localStorageMock = TestBed.inject(SsrLocalStorage) as MockSsrLocalStorage;
        // themeConfigMock is already assigned
        themeGeneratorMock = TestBed.inject(ThemeGeneratorService) as MockThemeGeneratorService;
        systemPrefsMock = TestBed.inject(SytemPrefsService) as MockSytemPrefsService;
        destroyRefMock = TestBed.inject(DestroyRef) as MockDestroyRef;

        // Mock localStorage retrieval
        if (storageData === 'error') {
          localStorageMock.getItemObject.mockImplementation(() => {
            throw new SyntaxError("Invalid JSON");
          });
        } else {
          localStorageMock.getItemObject.mockReturnValue(storageData === undefined ? null : storageData);
        }

        // Spy on internal methods *before* service creation if they are called in constructor/initialize
        jest.spyOn(ThemeService.prototype as any, 'applyCurrentTheme');
        jest.spyOn(ThemeService.prototype as any, 'storeTheme');
        jest.spyOn(ThemeService.prototype as any, 'setDefaultTheme');
        jest.spyOn(ThemeService.prototype as any, 'retrieveTheme').mockImplementation(() => localStorageMock.getItemObject(expect.any(String)));
        jest.spyOn(console, 'error').mockImplementation(() => { }); // Suppress console.error during tests

        service = TestBed.inject(ThemeService);
      };

      afterEach(() => {
        jest.restoreAllMocks(); // Restore original implementations and clear spies
      });

      // --- Initialization Tests (Keep existing ones) ---
      describe('Initialization', () => {
        it('should initialize with default theme when localStorage is empty', fakeAsync(() => {
            setupTestBed(); // No storage data provided

            tick(100); // Advance time for debounceTime

            expect(service.currentTheme()).toEqual(themeConfigMock.themeOptions[0]);
            expect(service.isDarkMode()).toEqual(!!themeConfigMock.themeOptions[0].darkMode); // Based on first theme's dark mode
            expect(service.customThemes()).toEqual([]);
            expect(localStorageMock.getItemObject).toHaveBeenCalledWith('moonlight_theme_key');
            expect((service as any).applyCurrentTheme).toHaveBeenCalled();
            expect((service as any).storeTheme).toHaveBeenCalled();
            expect((service as any).setDefaultTheme).not.toHaveBeenCalled(); // Should not call setDefaultTheme if initialization succeeds
        }));

        it('should initialize with stored theme data from localStorage', fakeAsync(() => {
            const storedData: ThemeData = {
            currentTheme: mockDarkTheme,
            customThemes: [mockCustomTheme1],
            version: '1.0' // Assuming ThemeData has a version or similar structure
            };
            // Ensure the stored theme's darkMode is used for the initial _isDarkModeBs state
            storedData.currentTheme = { ...mockDarkTheme, darkMode: true };
            setupTestBed(undefined, storedData);

            tick(100); // Advance time for debounceTime

            expect(service.currentTheme()).toEqual(storedData.currentTheme);
            // Check the BehaviorSubject directly as isDarkMode() signal might depend on async system prefs
            expect((service as any)._isDarkModeBs.value).toEqual(storedData.currentTheme.darkMode);
            expect(service.customThemes()).toEqual(storedData.customThemes);
            expect(localStorageMock.getItemObject).toHaveBeenCalledWith('moonlight_theme_key');
            expect((service as any).applyCurrentTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: storedData.currentTheme, customThemes: storedData.customThemes }));
            expect((service as any).storeTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: storedData.currentTheme, customThemes: storedData.customThemes }));
            expect((service as any).setDefaultTheme).not.toHaveBeenCalled();
        }));

        it('should initialize dark mode based on stored theme data darkMode property', fakeAsync(() => {
            const storedData: ThemeData = {
            currentTheme: { ...mockLightTheme, darkMode: 'system' }, // Explicitly set darkMode
            customThemes: [],
            version: '1.0'
            };
            setupTestBed(undefined, storedData);

            tick(100);

            expect((service as any)._isDarkModeBs.value).toEqual('system');
            // isDarkMode() signal will resolve based on system preference
            systemPrefsMock.prefersDarkMode$.next(true);
            tick(); // Allow signal to update
            expect(service.isDarkMode()).toBe(true);

            systemPrefsMock.prefersDarkMode$.next(false);
            tick(); // Allow signal to update
            expect(service.isDarkMode()).toBe(false);
        }));

        it('should initialize dark mode based on config default if stored theme lacks darkMode property', fakeAsync(() => {
            const storedData: ThemeData = {
            // Simulate older data structure or missing property
            currentTheme: { value: 'some-theme', label: 'Some Theme' } as any,
            customThemes: [],
            version: '0.9'
            };
            setupTestBed({ defaultDarkMode: true }, storedData); // Config defaults to dark

            tick(100);

            // Should fall back to config default
            expect((service as any)._isDarkModeBs.value).toBe(true);
            expect(service.isDarkMode()).toBe(true); // Signal reflects the initial value
        }));


        it('should handle SyntaxError during theme retrieval and set defaults', fakeAsync(() => {
            setupTestBed(undefined, 'error'); // Trigger error in mock

            // Initialization happens in constructor, error handling should call setDefaultTheme
            expect(console.error).toHaveBeenCalledWith('Error parsing stored theme data:', expect.any(SyntaxError));
            expect((service as any).setDefaultTheme).toHaveBeenCalledTimes(1);

            // Verify state after setDefaultTheme is called
            const defaultTheme = themeConfigMock.themeOptions[0] ?? defaultThemeOption;
            expect(service.currentTheme()).toEqual(defaultTheme);
            expect((service as any)._isDarkModeBs.value).toEqual(!!defaultTheme.darkMode);
            expect(service.customThemes()).toEqual([]); // Should be reset by resetToDefaults called within setDefaultTheme path

            // Ensure subscription still runs after error handling sets defaults
            tick(100);
            expect((service as any).applyCurrentTheme).toHaveBeenCalled();
            expect((service as any).storeTheme).toHaveBeenCalled();
        }));

        // Simplified TypeError test focusing on the outcome
        it('should handle generic Error during theme processing and set defaults', fakeAsync(() => {
            // Simulate an error during the processing phase after retrieval
            jest.spyOn(ThemeDataUtils, 'create').mockImplementation(() => {
                throw new Error("Simulated processing error");
            });

            setupTestBed(); // Initialize with potentially valid retrieval but failing processing

            // Error should be caught, logged, and defaults set
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Theme initialization error'), expect.any(Error));
            expect((service as any).setDefaultTheme).toHaveBeenCalled();

            // Verify state after setDefaultTheme
            const defaultTheme = themeConfigMock.themeOptions[0] ?? defaultThemeOption;
            expect(service.currentTheme()).toEqual(defaultTheme);
            expect((service as any)._isDarkModeBs.value).toEqual(!!defaultTheme.darkMode);

            tick(100); // Allow async operations
        }));


        it('should subscribe to _currentDataBs and call apply/store theme on change', fakeAsync(() => {
            const initialData: ThemeData = { currentTheme: mockLightTheme, customThemes: [], version: '1.0' };
            setupTestBed(undefined, initialData);

            tick(100); // Initial debounce

            // Verify initial calls
            expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(1);
            expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
            expect((service as any).applyCurrentTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: mockLightTheme }));
            expect((service as any).storeTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: mockLightTheme }));

            // Change theme
            service.setTheme(mockDarkTheme);
            tick(100); // Debounce after theme change

            expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(2);
            expect((service as any).storeTheme).toHaveBeenCalledTimes(2);
            expect((service as any).applyCurrentTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: mockDarkTheme }));
            expect((service as any).storeTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: mockDarkTheme }));

            // Change dark mode
            service.setDarkMode(true);
            tick(100); // Debounce after dark mode change

            expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(3);
            expect((service as any).storeTheme).toHaveBeenCalledTimes(3);
            // apply/store should be called with the current theme but reflecting the new dark mode state
            expect((service as any).applyCurrentTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: { ...mockDarkTheme, darkMode: true } }));
            expect((service as any).storeTheme).toHaveBeenCalledWith(expect.objectContaining({ currentTheme: { ...mockDarkTheme, darkMode: true } }));
        }));
      });

      // --- Public API Method Tests ---
      describe('Public API Methods', () => {

        beforeEach(() => {
            // Setup with default config and no stored data for a clean slate
            setupTestBed();
            tick(100); // Initial debounce/setup
            // Clear mocks called during initialization
            jest.clearAllMocks();
            // Reset spies specifically
            (service as any).applyCurrentTheme.mockClear();
            (service as any).storeTheme.mockClear();
            localStorageMock.setItemObject.mockClear();
            localStorageMock.removeItem.mockClear();
        });

        describe('setDarkMode', () => {
            it('should update _isDarkModeBs and trigger store/apply', fakeAsync(() => {
                service.setDarkMode(true);
                expect((service as any)._isDarkModeBs.value).toBe(true);
                tick(100); // debounceTime
                expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(1);
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1);

                service.setDarkMode(false);
                expect((service as any)._isDarkModeBs.value).toBe(false);
                tick(100); // debounceTime
                expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(2);
                expect((service as any).storeTheme).toHaveBeenCalledTimes(2);
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(2);
            }));

            it('should update _isDarkModeBs for "system" and trigger store/apply', fakeAsync(() => {
                service.setDarkMode('system');
                expect((service as any)._isDarkModeBs.value).toBe('system');
                tick(100); // debounceTime
                expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(1);
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1);
            }));

            it('should reflect system preference when mode is "system"', fakeAsync(() => {
                service.setDarkMode('system');
                tick(100); // debounceTime

                systemPrefsMock.prefersDarkMode$.next(true);
                tick(); // Allow signal update
                expect(service.isDarkMode()).toBe(true);

                systemPrefsMock.prefersDarkMode$.next(false);
                tick(); // Allow signal update
                expect(service.isDarkMode()).toBe(false);
            }));
        });

        describe('setTheme', () => {
            it('should update _currentThemeBs with the provided theme and trigger store/apply', fakeAsync(() => {
                service.setTheme(mockDarkTheme);
                expect((service as any)._currentThemeBs.value).toBe(mockDarkTheme);
                tick(100); // debounceTime
                expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(1);
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1);
            }));

            it('should fall back to the first system theme if null is provided', fakeAsync(() => {
                const firstSystemTheme = themeConfigMock.themeOptions[0];
                service.setTheme(null);
                expect((service as any)._currentThemeBs.value).toBe(firstSystemTheme);
                tick(100); // debounceTime
                expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(1);
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
            }));

            it('should fall back to the first system theme if undefined is provided', fakeAsync(() => {
                const firstSystemTheme = themeConfigMock.themeOptions[0];
                service.setTheme(undefined);
                expect((service as any)._currentThemeBs.value).toBe(firstSystemTheme);
                tick(100); // debounceTime
                expect((service as any).applyCurrentTheme).toHaveBeenCalledTimes(1);
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
            }));
        });

        describe('exportThemeSettings', () => {
            it('should return the current theme and dark mode status', fakeAsync(() => {
                // Set specific state
                service.setTheme(mockDarkTheme);
                service.setDarkMode(true);
                tick(100); // Ensure state updates are processed

                const settings = service.exportThemeSettings();

                expect(settings).toEqual({
                    theme: mockDarkTheme,
                    isDark: true
                });
            }));

            it('should return correct dark mode status when set to "system"', fakeAsync(() => {
                service.setTheme(mockLightTheme); // A theme that defaults to light
                service.setDarkMode('system');
                systemPrefsMock.prefersDarkMode$.next(true); // System prefers dark
                tick(100); // Process state updates
                tick(); // Process signal update

                const settings = service.exportThemeSettings();

                expect(settings).toEqual({
                    theme: mockLightTheme,
                    isDark: true // Reflects the system preference
                });
            }));
        });

        describe('addCustomTheme', () => {
            it('should add a new custom theme and sanitize its value', fakeAsync(() => {
                const newTheme: ThemeOption = { value: ' My New Theme ', label: 'My New Theme', primaryColor: '#123456', secondaryColor: '#abcdef', darkMode: false };
                const expectedSanitizedValue = 'custom-my-new-theme-'; // Note: trailing hyphen due to regex
                const expectedTheme = { ...newTheme, value: expectedSanitizedValue };

                const updatedThemes = service.addCustomTheme(newTheme);

                expect(service.customThemes()).toContainEqual(expectedTheme);
                expect(updatedThemes).toContainEqual(expectedTheme);
                expect(updatedThemes.length).toBe(1);

                tick(100); // debounceTime for store/apply
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1);
                // Check if stored data includes the new theme
                const storeCallArgs = (service as any).storeTheme.mock.calls[0][0];
                expect(storeCallArgs.customThemes).toContainEqual(expectedTheme);
            }));

            it('should update an existing custom theme if value matches after sanitization', fakeAsync(() => {
                // Add initial theme
                const initialTheme: ThemeOption = { value: 'custom-blue', label: 'Old Blue', primaryColor: '#0000ff', secondaryColor: '#ffffff', darkMode: false };
                service.addCustomTheme(initialTheme);
                tick(100); // Process initial add

                // Add theme with same sanitized value but different properties
                const updatedThemeData: ThemeOption = { value: 'custom-blue', label: 'New Blue', primaryColor: '#abcdef', secondaryColor: '#123456', darkMode: true };
                const updatedThemes = service.addCustomTheme(updatedThemeData);

                expect(service.customThemes().length).toBe(1); // Should still be only one theme
                expect(service.customThemes()[0]).toEqual(updatedThemeData); // The updated theme should be present
                expect(updatedThemes).toEqual([updatedThemeData]);

                tick(100); // debounceTime for store/apply
                expect((service as any).storeTheme).toHaveBeenCalledTimes(2); // Called for initial add and update
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(2);
                const storeCallArgs = (service as any).storeTheme.mock.calls[1][0]; // Check the second call
                expect(storeCallArgs.customThemes).toEqual([updatedThemeData]);
            }));

            it('should correctly sanitize values with spaces and mixed case', () => {
                const theme: ThemeOption = { value: ' Theme With Spaces ', label: 'Test', primaryColor: '#fff', secondaryColor: '#000', darkMode: false };
                const sanitizedValue = (service as any).sanitizeValue(theme.value);
                expect(sanitizedValue).toBe('custom-theme-with-spaces-');
            });

            it('should add "custom-" prefix if not present', () => {
                const theme: ThemeOption = { value: 'mytheme', label: 'Test', primaryColor: '#fff', secondaryColor: '#000', darkMode: false };
                const sanitizedValue = (service as any).sanitizeValue(theme.value);
                expect(sanitizedValue).toBe('custom-mytheme');
            });

            it('should not add "custom-" prefix if already present', () => {
                const theme: ThemeOption = { value: 'custom-existing', label: 'Test', primaryColor: '#fff', secondaryColor: '#000', darkMode: false };
                const sanitizedValue = (service as any).sanitizeValue(theme.value);
                expect(sanitizedValue).toBe('custom-existing');
            });
        });

        describe('removeCustomTheme', () => {
            beforeEach(fakeAsync(() => {
                // Add some themes to remove
                service.addCustomTheme(mockCustomTheme1);
                service.addCustomTheme(mockCustomTheme2);
                tick(100); // Process adds
                (service as any).storeTheme.mockClear(); // Clear mocks after setup
                localStorageMock.setItemObject.mockClear();
            }));

            it('should remove an existing custom theme by value', fakeAsync(() => {
                const valueToRemove = mockCustomTheme1.value; // 'custom-blue'
                const updatedThemes = service.removeCustomTheme(valueToRemove);

                expect(service.customThemes()).not.toContainEqual(mockCustomTheme1);
                expect(service.customThemes()).toContainEqual(mockCustomTheme2);
                expect(service.customThemes().length).toBe(1);
                expect(updatedThemes).toEqual([mockCustomTheme2]);

                tick(100); // debounceTime for store/apply
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1);
                const storeCallArgs = (service as any).storeTheme.mock.calls[0][0];
                expect(storeCallArgs.customThemes).toEqual([mockCustomTheme2]);
            }));

            it('should do nothing if the theme value does not exist', fakeAsync(() => {
                const initialThemes = [...service.customThemes()];
                const valueToRemove = 'non-existent-theme';
                const updatedThemes = service.removeCustomTheme(valueToRemove);

                expect(service.customThemes()).toEqual(initialThemes); // Should be unchanged
                expect(service.customThemes().length).toBe(2);
                expect(updatedThemes).toEqual(initialThemes);

                tick(100); // debounceTime for store/apply
                // Store might still be called due to BehaviorSubject update, even if value is same
                // Let's verify the *content* stored hasn't changed meaningfully
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1);
                const storeCallArgs = (service as any).storeTheme.mock.calls[0][0];
                expect(storeCallArgs.customThemes).toEqual(initialThemes);
            }));
        });

        describe('resetToDefaults', () => {
            beforeEach(fakeAsync(() => {
                // Set some non-default state
                service.addCustomTheme(mockCustomTheme1);
                service.setTheme(mockDarkTheme);
                service.setDarkMode(true);
                tick(100); // Process updates
                (service as any).storeTheme.mockClear(); // Clear mocks after setup
                localStorageMock.setItemObject.mockClear();
                localStorageMock.removeItem.mockClear();
            }));

            it('should clear custom themes, reset current theme and dark mode, and clear storage', fakeAsync(() => {
                const defaultSystemTheme = themeConfigMock.themeOptions[0];
                const expectedDarkMode = defaultSystemTheme.darkMode;

                service.resetToDefaults();

                // Check state immediately
                expect(service.customThemes()).toEqual([]);
                expect((service as any)._currentThemeBs.value).toEqual(defaultSystemTheme);
                expect((service as any)._isDarkModeBs.value).toEqual(expectedDarkMode);

                // Check signals after potential async updates
                tick();
                expect(service.currentTheme()).toEqual(defaultSystemTheme);
                expect(service.isDarkMode()).toEqual(!!expectedDarkMode); // Coerce 'system' if needed

                // Check side effects
                expect(localStorageMock.removeItem).toHaveBeenCalledWith('moonlight_theme_key');

                // Check async store/apply calls triggered by state resets
                tick(100); // debounceTime
                expect((service as any).storeTheme).toHaveBeenCalledTimes(1); // Should be called once due to state changes
                expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1); // storeTheme calls setItemObject
                const storeCallArgs = (service as any).storeTheme.mock.calls[0][0];
                expect(storeCallArgs.customThemes).toEqual([]);
                expect(storeCallArgs.currentTheme).toEqual({ ...defaultSystemTheme, darkMode: expectedDarkMode });
            }));
        });
      });
    });
       expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component['_themeForm'].value).toEqual({
        primary: DEFAULT_COLOR_PRIMARY,
        secondary: DEFAULT_COLOR_SECONDARY,
        tertiary: null,
        error: null,
        darkMode: false
      });
    });

    describe('applyTheme', () => {
      it('should NOT call generator if form is invalid', () => {
        component['_themeForm'].controls.primaryColor.setValue(''); // Make form invalid
        component['applyTheme'](); // <--- Use bracket notation
        expect(themeGeneratorMock.applyTheme).not.toHaveBeenCalled();
      });

      it('should call generator with correct theme options when form is valid', () => {
        const formValues = {
          primary: '#ff0000',
          secondary: '#00ff00',
          tertiary: '#0000ff',
          error: '#ff00ff',
          darkMode: true
        };
        component['_themeForm'].setValue(formValues);
        component['applyTheme'](); // <--- Use bracket notation

        const expectedThemeArg = expect.objectContaining({
          primaryColor: formValues.primary,
          secondaryColor: formValues.secondary,
          tertiaryColor: formValues.tertiary,
          errorColor: formValues.error,
          fallbackIsDarkMode: formValues.darkMode,
          label: 'Custom', // Or check dynamic label logic if implemented
          // value: expect.stringContaining('custom-') // Check dynamic value
        });

        expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(1);
        expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(
          expectedThemeArg,
          document.documentElement,
          formValues.darkMode
        );
      });
    });

    describe('applyPreset', () => {
       it('should do nothing if preset value not found', () => {
         component['applyPreset']('nonexistent-preset'); // <--- Use bracket notation
         expect(component['_themeForm'].value.primaryColor).toBe(DEFAULT_COLOR_PRIMARY); // Form shouldn't change
         expect(themeGeneratorMock.applyTheme).not.toHaveBeenCalled();
       });

       it('should patch form and call generator with preset theme', () => {
         const presetToApply = mockPresets[1]; // e.g., Preset 2
         component['applyPreset'](presetToApply.value); // <--- Use bracket notation

         // Check form patching
         expect(component['_themeForm'].value).toEqual(expect.objectContaining({
           primary: presetToApply.primaryColor,
           secondary: presetToApply.secondaryColor,
           // tertiary/error might be null/undefined in preset, check accordingly
         }));

         // Check generator call
         expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(1);
         expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(
           presetToApply,
           document.documentElement,
           presetToApply.darkMode
         );
       });
    });

     describe('openScssDialog', () => {
        it('should call exportThemeAsScss and dialog.open', () => {
            // Reset mocks (might not be needed if beforeEach handles it)
            // directDialogMock.open.mockClear(); 
            themeGeneratorMock.exportThemeAsScss.mockClear();
            themeGeneratorMock.exportThemeAsScss.mockReturnValue('// Some SCSS');

            // Act
            fixture.detectChanges(); // Trigger rendering if needed before action
            component['openScssDialog'](); 

            // Assert
            expect(themeGeneratorMock.exportThemeAsScss).toHaveBeenCalledTimes(1);
            // Assert on the mock function directly
            expect(directDialogMock.open).toHaveBeenCalledTimes(1); 
            expect(directDialogMock.open).toHaveBeenCalledWith(
                ScssDisplayComponent, 
                expect.objectContaining({ data: { scssContent: '// Some SCSS' } })
            );
        });

        it('should NOT call dialog.open if export returns null/empty', () => {
            // Reset mocks
            // directDialogMock.open.mockClear();
            themeGeneratorMock.exportThemeAsScss.mockClear();
            themeGeneratorMock.exportThemeAsScss.mockReturnValueOnce(null); 

            // Act
            fixture.detectChanges(); // Trigger rendering if needed before action
            component['openScssDialog'](); 

            // Assert
            expect(themeGeneratorMock.exportThemeAsScss).toHaveBeenCalledTimes(1);
            // Assert on the mock function directly
            expect(directDialogMock.open).not.toHaveBeenCalled(); 
        });
     });

  }); // End Group 1

  // --- Group 2: Input Binding Tests ---
  describe('Input Bindings', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let childComponent: ThemeSelectorComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          TestHostComponent, // Imports ThemeSelectorComponent implicitly
          ReactiveFormsModule, // Needed by ThemeSelectorComponent's template/form
          NoopAnimationsModule,
        ],
        providers: [
          // Provide mocks needed by the *child* ThemeSelectorComponent
          { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
          { provide: ThemeConfigService, useValue: mockThemeConfig },
          { provide: MatDialog, useValue: { open: jest.fn() } } // Simple mock for DI
        ]
      }).compileComponents();
    });

    it('should use presets from config service by default (when input undefined)', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      // hostComponent.hostPresets remains undefined
      hostFixture.detectChanges(); // Render host + child

      const childDebugElement = hostFixture.debugElement.query(By.directive(ThemeSelectorComponent));
      expect(childDebugElement).not.toBeNull();
      childComponent = childDebugElement.componentInstance;

      // Check the computed signal which handles the fallback
      expect(childComponent['_presetThemes']()).toEqual(mockPresets);
    });

    it('should allow overriding presets via input', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      const hostComponent = hostFixture.componentInstance;
      const customPresets: ThemeOption[] = [{ value: 'custom', label: 'Custom', primaryColor: '#ccc', secondaryColor: '#ddd', fallbackIsDarkMode: false }];

      hostComponent.hostPresets = customPresets; // Set input value on host
      hostFixture.detectChanges(); // Render host + child, binding the input

      const childDebugElement = hostFixture.debugElement.query(By.directive(ThemeSelectorComponent));
      expect(childDebugElement).not.toBeNull();
      childComponent = childDebugElement.componentInstance;

      // Check the computed signal which should now use the input value
      expect(childComponent['_presetThemes']()).toEqual(customPresets);
    });
  }); // End Group 2

  // --- Group 3: Harness Tests (Dialog Interaction) ---
  describe('Dialog Interaction (Harness)', () => {
    let fixture: ComponentFixture<ThemeSelectorComponent>;
    let loader: HarnessLoader; // Document root loader

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          MatDialogModule, // Import REAL MatDialogModule
          NoopAnimationsModule,
          ThemeSelectorComponent, // The component under test
          ScssDisplayComponent // The component opened in the dialog
        ],
        providers: [
          // Provide mocks needed by ThemeSelectorComponent
          { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
          { provide: ThemeConfigService, useValue: mockThemeConfig },
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ThemeSelectorComponent);
      // Use documentRootLoader for dialogs
      loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
      fixture.detectChanges();
    });

    it('should open ScssDisplayComponent dialog using harness', async () => {
      // Reset mock return value for this specific test if needed
      themeGeneratorMock.exportThemeAsScss.mockReturnValue('// Harness SCSS content');

      // Act: Call the method that opens the dialog
      fixture.componentInstance['openScssDialog']();
      // fixture.detectChanges(); // Might not be needed if openScssDialog doesn't rely on template changes

      // Assert: Check if a dialog is open
      const dialogs = await loader.getAllHarnesses(MatDialogHarness);
      expect(dialogs.length).toBe(1);

      // Optional: Assert dialog content or component type if ScssDisplayComponent had a harness
      // const dialog = dialogs[0];
      // expect(await dialog.getTitleText()).toBe('SCSS Output'); // Example if dialog had title
      // expect(await dialog.getContentText()).toContain('// Harness SCSS content');
    });

     it('should NOT open dialog if export returns null (harness)', async () => {
        themeGeneratorMock.exportThemeAsScss.mockReturnValueOnce(null);
        fixture.componentInstance.openScssDialog();

        const dialogs = await loader.getAllHarnesses(MatDialogHarness);
        expect(dialogs.length).toBe(0);
     });

  }); // End Group 3

}); // End Main Describe