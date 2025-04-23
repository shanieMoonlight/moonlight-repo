import { DestroyRef } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { SsrLocalStorage } from '../../../../ssr/storage/src/index';
import { ThemeConfigService, ThemeOption, ThemingConfig, defaultThemeOption, DarkModeType } from '../../../config/src/index';
import { DynamicThemeConfigService } from '../../../config/src/lib/dynamic-theming-config';
import { ThemeGeneratorService } from './generator/theme-generator.service';
import { SystemPrefsService } from './generator/utils/sytem-prefs/sytem-prefs.service';
import { ThemeData, ThemeDataUtils } from './theme-data';
import { ThemeService } from './theme.service';
import { ThemeTransitionService } from './transitions/transitions.service';

// Mocks
const mockDefaultTheme: ThemeOption = ThemeOption.create({ ...defaultThemeOption, value: 'default-light', label: 'Default Light',  darkMode: 'light' });
const mockDarkTheme: ThemeOption = ThemeOption.create({ value: 'system-dark', label: 'System Dark',  darkMode: 'dark', primaryColor: '#000000', secondaryColor: '#ffffff' });
const mockLightTheme: ThemeOption = ThemeOption.create({ value: 'system-light', label: 'System Light',  darkMode: 'light', primaryColor: '#ffffff', secondaryColor: '#000000' });
const mockCustomTheme: ThemeOption = ThemeOption.create({ value: 'custom-blue', label: 'Custom Blue',  darkMode: 'light', primaryColor: '#0000ff', secondaryColor: '#ffffff' });

class MockSsrLocalStorage {
  getItemObject = jest.fn();
  setItemObject = jest.fn();
  removeItem = jest.fn();
}

class MockSystemPrefsService {
  prefersDarkMode$ = new BehaviorSubject<boolean>(false); // Default to light
}

class MockThemeGeneratorService {
  applyTheme = jest.fn();
}

// Declare a variable to hold the reference but don't use it in the class definition yet
let themeGeneratorMockInstance: MockThemeGeneratorService;

class MockThemeTransitionService {
  // Don't reference the undefined mock in the class definition
  transitionThemes = jest.fn();

  // Add a method to set up the implementation after injection
  setupImplementation(generatorMock: MockThemeGeneratorService) {
    this.transitionThemes.mockImplementation((previousTheme, currentTheme, isDark) => {
      generatorMock.applyTheme(currentTheme, undefined, undefined);
    });
  }
}

class MockDestroyRef extends DestroyRef {
  onDestroy = jest.fn();
  constructor() { super(); }
}

class MockDynamicThemeConfigService {
  defaultDarkMode = 'light';
  themeClassPrefix = 'theme';
  transitionOptions = {
    showTransitions: true,
    style: 'overlay',
    duration: 300
  };

  private _themes = [mockLightTheme, mockDarkTheme];

  systemThemes = jest.fn().mockImplementation(() => this._themes);
  systemThemes$ = new BehaviorSubject(this._themes);

  setSystemThemes(themes) {
    this._themes = themes;
    this.systemThemes.mockImplementation(() => themes);
    this.systemThemes$.next(themes);
  }
}

const createMockThemeConfig = (overrides?: Partial<ThemingConfig>): ThemingConfig => {
  const config = ThemingConfig.create();
  config.themeOptions = [mockLightTheme, mockDarkTheme];
  config.defaultDarkModeType = 'light';
  if (overrides) {
    Object.assign(config, overrides);
  }
  return config;
};

// Helper outside all describes
const setupTestBedHelper = (configOverrides?: Partial<ThemingConfig>, storageData?: ThemeData | null | 'error') => {
  const themeConfigMock = createMockThemeConfig(configOverrides);

  const dynamicConfigMock = new MockDynamicThemeConfigService();
  dynamicConfigMock.setSystemThemes(themeConfigMock.themeOptions);
  dynamicConfigMock.defaultDarkMode = themeConfigMock.defaultDarkModeType;

  TestBed.configureTestingModule({
    providers: [
      ThemeService,
      { provide: SsrLocalStorage, useClass: MockSsrLocalStorage },
      { provide: SystemPrefsService, useClass: MockSystemPrefsService },
      { provide: ThemeConfigService, useValue: themeConfigMock },
      { provide: DynamicThemeConfigService, useValue: dynamicConfigMock },
      { provide: ThemeGeneratorService, useClass: MockThemeGeneratorService },
      { provide: ThemeTransitionService, useClass: MockThemeTransitionService },
      { provide: DestroyRef, useClass: MockDestroyRef },
    ],
  });

  const localStorageMock = TestBed.inject(SsrLocalStorage) as unknown as MockSsrLocalStorage;
  const themeGeneratorMock = TestBed.inject(ThemeGeneratorService) as unknown as MockThemeGeneratorService;
  const themeTransitionMock = TestBed.inject(ThemeTransitionService) as unknown as MockThemeTransitionService;
  const systemPrefsMock = TestBed.inject(SystemPrefsService) as unknown as MockSystemPrefsService;
  const destroyRefMock = TestBed.inject(DestroyRef) as unknown as MockDestroyRef;

  if (storageData === 'error') {
    localStorageMock.getItemObject.mockImplementation(() => {
      throw new SyntaxError("Invalid JSON");
    });
  } else {
    localStorageMock.getItemObject.mockReturnValue(storageData === undefined ? null : storageData);
  }

  jest.spyOn(ThemeService.prototype as any, 'setDefaultTheme');
  jest.spyOn(console, 'error').mockImplementation(() => { });

  // Set up the transition mock implementation
  themeTransitionMock.setupImplementation(themeGeneratorMock);

  return {
    service: TestBed.inject(ThemeService),
    localStorageMock,
    themeConfigMock,
    dynamicConfigMock,
    themeGeneratorMock,
    themeTransitionMock,
    systemPrefsMock,
    destroyRefMock,
  };
};

describe('ThemeService Initialization and Core Logic', () => {
  let service: ThemeService;
  let localStorageMock: MockSsrLocalStorage;
  let themeConfigMock: ThemingConfig;
  let dynamicConfigMock: MockDynamicThemeConfigService;
  let themeGeneratorMock: MockThemeGeneratorService;
  let themeTransitionMock: MockThemeTransitionService;
  let systemPrefsMock: MockSystemPrefsService;
  let destroyRefMock: MockDestroyRef;

  const setupTestBed = (configOverrides?: Partial<ThemingConfig>, storageData?: ThemeData | null | 'error') => {
    localStorageMock = new MockSsrLocalStorage();
    systemPrefsMock = new MockSystemPrefsService();
    themeGeneratorMock = new MockThemeGeneratorService();
    themeTransitionMock = new MockThemeTransitionService();

    if (storageData === 'error') {
      localStorageMock.getItemObject.mockImplementation(() => {
        throw new SyntaxError("Invalid JSON");
      });
    } else {
      localStorageMock.getItemObject.mockReturnValue(storageData === undefined ? null : storageData);
    }

    themeConfigMock = createMockThemeConfig(configOverrides);
    dynamicConfigMock = new MockDynamicThemeConfigService();

    dynamicConfigMock.systemThemes.mockReturnValue(themeConfigMock.themeOptions);
    dynamicConfigMock.systemThemes$.next(themeConfigMock.themeOptions);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: DynamicThemeConfigService, useValue: dynamicConfigMock },
        { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
        { provide: ThemeTransitionService, useValue: themeTransitionMock },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ],
    });

    jest.spyOn(ThemeService.prototype as any, 'setDefaultTheme');
    jest.spyOn(console, 'error').mockImplementation(() => { });

    service = TestBed.inject(ThemeService);

    // Set up the transition mock implementation
    themeTransitionMock.setupImplementation(themeGeneratorMock);

    return {
      service,
      localStorageMock,
      themeConfigMock,
      dynamicConfigMock,
      themeGeneratorMock,
      themeTransitionMock,
      systemPrefsMock
    };
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default theme when localStorage is empty', fakeAsync(() => {
    setupTestBed();

    tick(100);

    expect(service.currentTheme()).toEqual(themeConfigMock.themeOptions[0]);
    expect((service as any).darkModeType()).toEqual(themeConfigMock.themeOptions[0].darkMode);
    expect(service.customThemes()).toEqual([]);
    expect(localStorageMock.getItemObject).toHaveBeenCalledWith('moonlight_theme_key');

    expect(themeGeneratorMock.applyTheme).toHaveBeenCalled();

    expect(localStorageMock.setItemObject).toHaveBeenCalled();
    expect((service as any).setDefaultTheme).not.toHaveBeenCalled();
  }));

  it('should initialize with stored theme data from localStorage', fakeAsync(() => {
    const storedData: ThemeData = ThemeDataUtils.create(
      { ...mockDarkTheme,  darkMode: 'dark' },
      [mockCustomTheme]
    );
    setupTestBed(undefined, storedData);

    tick(100);

    expect(service.currentTheme()).toEqual(storedData.currentTheme);
    expect((service as any).darkModeType()).toEqual(storedData.currentTheme.darkMode);
    expect(service.customThemes()).toEqual(storedData.customThemes);
    expect(localStorageMock.getItemObject).toHaveBeenCalledWith('moonlight_theme_key');
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(expect.objectContaining({ ...storedData.currentTheme,  darkMode: 'dark' }), undefined, undefined);
    const expectedStoredData = ThemeDataUtils.create({ ...storedData.currentTheme,  darkMode: 'dark' }, storedData.customThemes);
    expect(localStorageMock.setItemObject).toHaveBeenCalledWith('moonlight_theme_key', expectedStoredData);
    expect((service as any).setDefaultTheme).not.toHaveBeenCalled();
  }));

  it('should initialize dark mode based on stored theme data darkMode property (system)', fakeAsync(() => {
    const storedData: ThemeData = ThemeDataUtils.create(
      { ...mockLightTheme, darkMode: 'system' },
      []
    );
    setupTestBed(undefined, storedData);

    tick(100);

    expect((service as any).darkModeType()).toEqual('system');
    systemPrefsMock.prefersDarkMode$.next(true);
    tick();
    expect(service.isDarkMode()).toBe(true);

    systemPrefsMock.prefersDarkMode$.next(false);
    tick();
    expect(service.isDarkMode()).toBe(false);
  }));



  it('should initialize dark mode based on config default if stored theme lacks darkMode property', fakeAsync(() => {
    // Create a theme without darkMode property that will exist in system themes
    const storedThemeWithoutDarkMode = {
      value: 'some-theme',
      label: 'Some Theme',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00'
    } as ThemeOption; // Cast as ThemeOption but intentionally missing darkMode

    // Create stored data with this theme
    const storedData: ThemeData = {
      currentTheme: storedThemeWithoutDarkMode,
      customThemes: [],
    };

    // Create a special mock for this specific test
    const specialDynamicConfigMock = new MockDynamicThemeConfigService();
    specialDynamicConfigMock.defaultDarkMode = 'dark';
    // Ensure the systemThemes includes our stored theme to prevent effect from replacing it
    specialDynamicConfigMock.systemThemes.mockReturnValue([storedThemeWithoutDarkMode, mockLightTheme]);
    specialDynamicConfigMock.systemThemes$.next([storedThemeWithoutDarkMode, mockLightTheme]);

    // Setup test with our special mock and stored data
    localStorageMock = new MockSsrLocalStorage();
    systemPrefsMock = new MockSystemPrefsService();
    themeGeneratorMock = new MockThemeGeneratorService();
    themeTransitionMock = new MockThemeTransitionService();

    // Configure localStorage to return our stored data
    localStorageMock.getItemObject.mockReturnValue(storedData);

    // Create config with dark mode default = true
    themeConfigMock = createMockThemeConfig({ defaultDarkModeType: 'dark' });

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: DynamicThemeConfigService, useValue: specialDynamicConfigMock }, // Use our special mock
        { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
        { provide: ThemeTransitionService, useValue: themeTransitionMock },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ],
    });

    jest.spyOn(ThemeService.prototype as any, 'setDefaultTheme');
    jest.spyOn(console, 'error').mockImplementation(() => { });

    service = TestBed.inject(ThemeService);
    themeTransitionMock.setupImplementation(themeGeneratorMock);

    tick(100);

    // Check that darkMode was set based on config default (dark)
    expect((service as any)._darkModeTypeBs.value).toBe('dark');
    expect(service.isDarkMode()).toBe(true);
  }));



  it('should handle SyntaxError during theme retrieval and set defaults', fakeAsync(() => {
    setupTestBed(undefined, 'error');

    expect(console.error).toHaveBeenCalled();
    expect((service as any).setDefaultTheme).toHaveBeenCalledTimes(1);

    const defaultTheme = themeConfigMock.themeOptions[0] ?? defaultThemeOption;
    expect(service.currentTheme()).toEqual(defaultTheme);
    expect((service as any).darkModeType()).toEqual(defaultTheme.darkMode);

    tick(100);
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalled();
    expect(localStorageMock.setItemObject).toHaveBeenCalled();
  }));

  it('should handle TypeError during theme retrieval and set defaults', fakeAsync(() => {
    localStorageMock = new MockSsrLocalStorage();
    localStorageMock.getItemObject.mockImplementation(() => {
      throw new TypeError("Simulated TypeError from storage");
    });

    themeConfigMock = createMockThemeConfig();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useClass: MockSystemPrefsService },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: ThemeGeneratorService, useClass: MockThemeGeneratorService },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ],
    });
    jest.spyOn(ThemeService.prototype as any, 'setDefaultTheme');
    jest.spyOn(console, 'error').mockImplementation(() => { });

    service = TestBed.inject(ThemeService);

    expect(console.error).toHaveBeenCalled();
    expect((service as any).setDefaultTheme).toHaveBeenCalledTimes(1);

    const defaultTheme = themeConfigMock.themeOptions[0] ?? defaultThemeOption;
    expect(service.currentTheme()).toEqual(defaultTheme);
    expect((service as any).darkModeType()).toEqual(defaultTheme.darkMode);

    tick(100);
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalled();
    expect(localStorageMock.setItemObject).toHaveBeenCalled();
  }));

  it('should subscribe to _currentDataBs and call apply/store theme on change', fakeAsync(() => {
    const initialData: ThemeData = ThemeDataUtils.create(mockLightTheme, []);
    setupTestBed(undefined, initialData);

    tick(100);

    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(1);
    const expectedInitialCallData = ThemeDataUtils.create({ ...mockLightTheme, darkMode: mockLightTheme.darkMode }, []);
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(expectedInitialCallData.currentTheme, undefined, undefined);
    expect(localStorageMock.setItemObject).toHaveBeenCalledWith('moonlight_theme_key', expectedInitialCallData);

    service.setTheme(mockDarkTheme);
    tick(100);

    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(2);
    expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(2);
    const expectedThemeChangeData = ThemeDataUtils.create({ ...mockDarkTheme, darkMode: mockLightTheme.darkMode }, []);
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(expectedThemeChangeData.currentTheme, undefined, undefined);
    expect(localStorageMock.setItemObject).toHaveBeenCalledWith('moonlight_theme_key', expectedThemeChangeData);

    service.setDarkMode('dark');
    tick(100);

    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(3);
    expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(3);
    const expectedDarkModeChangeData = ThemeDataUtils.create({ ...mockDarkTheme,  darkMode: 'dark' }, []);
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(expectedDarkModeChangeData.currentTheme, undefined, undefined);
    expect(localStorageMock.setItemObject).toHaveBeenCalledWith('moonlight_theme_key', expectedDarkModeChangeData);
  }));

});

describe('ThemeService Enhanced Features', () => {
  let service: ThemeService;
  let localStorageMock: MockSsrLocalStorage;
  let themeConfigMock: ThemingConfig;
  let dynamicConfigMock: MockDynamicThemeConfigService;
  let themeGeneratorMock: MockThemeGeneratorService;
  let themeTransitionMock: MockThemeTransitionService;
  let systemPrefsMock: MockSystemPrefsService;
  let destroyRefMock: MockDestroyRef;

  beforeEach(() => {
    const result = setupTestBedHelper();
    service = result.service;
    localStorageMock = result.localStorageMock;
    themeConfigMock = result.themeConfigMock;
    dynamicConfigMock = result.dynamicConfigMock;
    themeGeneratorMock = result.themeGeneratorMock;
    themeTransitionMock = result.themeTransitionMock;
    systemPrefsMock = result.systemPrefsMock;
    destroyRefMock = result.destroyRefMock;
  });

  it('should use transitions when applying themes and transitions are enabled', fakeAsync(() => {
    // Reset TestBed first before configuring it again
    TestBed.resetTestingModule();

    // Create a fresh service instance with proper mocks for this specific test
    const localStorageMock = new MockSsrLocalStorage();
    const systemPrefsMock = new MockSystemPrefsService();
    const themeGeneratorMock = new MockThemeGeneratorService();
    const themeTransitionMock = new MockThemeTransitionService();
    themeTransitionMock.transitionThemes = jest.fn();

    // Create a dynamic config mock with transitions enabled
    const dynamicConfigMock = new MockDynamicThemeConfigService();
    dynamicConfigMock.transitionOptions = { showTransitions: true, style: 'overlay', duration: 300 };

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: DynamicThemeConfigService, useValue: dynamicConfigMock },
        { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
        { provide: ThemeTransitionService, useValue: themeTransitionMock },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ]
    });

    // Get service
    const service = TestBed.inject(ThemeService);

    // DIRECT APPROACH - Bypass the reactive chain and test the protected method directly
    // This isolates the test to just the transition logic, not the whole reactive chain

    // Create theme data objects for testing
    const darkThemeData = ThemeDataUtils.create(mockDarkTheme, []);
    const lightThemeData = ThemeDataUtils.create(mockLightTheme, []);

    // First call to set _previousTheme
    (service as any).applyCurrentTheme(darkThemeData);

    // Second call should trigger transition
    (service as any).applyCurrentTheme(lightThemeData);

    // Verify transition was called
    expect(themeTransitionMock.transitionThemes).toHaveBeenCalledWith(
      expect.objectContaining({ value: mockDarkTheme.value }),
      expect.objectContaining({ value: mockLightTheme.value }),
      expect.any(String)
    );
  }));

  //- - - - - - - - - - - - - - -//

  it('should not use transitions when transitions are disabled', fakeAsync(() => {
    // Reset TestBed first before configuring it again
    TestBed.resetTestingModule();

    // Create a fresh service instance with proper mocks for this specific test
    const localStorageMock = new MockSsrLocalStorage();
    const systemPrefsMock = new MockSystemPrefsService();
    const themeGeneratorMock = new MockThemeGeneratorService();
    const themeTransitionMock = new MockThemeTransitionService();
    themeTransitionMock.transitionThemes = jest.fn();

    // Create a dynamic config mock with transitions DISABLED
    const dynamicConfigMock = new MockDynamicThemeConfigService();
    dynamicConfigMock.transitionOptions = { showTransitions: false, style: 'overlay', duration: 300 };

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: DynamicThemeConfigService, useValue: dynamicConfigMock },
        { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
        { provide: ThemeTransitionService, useValue: themeTransitionMock },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ]
    });

    // Get service
    const service = TestBed.inject(ThemeService);

    // DIRECT APPROACH - Bypass the reactive chain and test the protected method directly
    // This isolates the test to just the transition logic, not the whole reactive chain

    // Create theme data objects for testing
    const darkThemeData = ThemeDataUtils.create(mockDarkTheme, []);
    const lightThemeData = ThemeDataUtils.create(mockLightTheme, []);

    // First call to set _previousTheme
    (service as any).applyCurrentTheme(darkThemeData);

    // Second call should NOT trigger transition because transitions are disabled
    (service as any).applyCurrentTheme(lightThemeData);

    // Verify themeGenerator.applyTheme was called directly (no transition)
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(2);
    expect(themeTransitionMock.transitionThemes).not.toHaveBeenCalled();
  }));

  //- - - - - - - - - - - - - - -//

  it('should not use transitions when applying to a specific element', fakeAsync(() => {
    dynamicConfigMock.transitionOptions.showTransitions = true;

    const testElement = document.createElement('div');

    const themeData = ThemeDataUtils.create(mockDarkTheme, []);
    (service as any).applyCurrentTheme(themeData, testElement);

    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(
      expect.objectContaining({ value: mockDarkTheme.value }),
      undefined,
      testElement
    );
    expect(themeTransitionMock.transitionThemes).not.toHaveBeenCalled();
  }));

  //- - - - - - - - - - - - - - -//

  it('should reset to default theme when current theme is removed from available themes', fakeAsync(() => {
    // Reset TestBed for a clean environment
    TestBed.resetTestingModule();

    // Create fresh mocks
    const localStorageMock = new MockSsrLocalStorage();
    const systemPrefsMock = new MockSystemPrefsService();
    const themeGeneratorMock = new MockThemeGeneratorService();
    const themeTransitionMock = new MockThemeTransitionService();
    themeTransitionMock.transitionThemes = jest.fn();

    // Create mock with both themes initially
    const dynamicConfigMock = new MockDynamicThemeConfigService();
    dynamicConfigMock.setSystemThemes([mockDarkTheme, mockLightTheme]);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: DynamicThemeConfigService, useValue: dynamicConfigMock },
        { provide: ThemeGeneratorService, useValue: themeGeneratorMock },
        { provide: ThemeTransitionService, useValue: themeTransitionMock },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ]
    });

    const service = TestBed.inject(ThemeService);

    // First set the theme to mockDarkTheme
    service.setTheme(mockDarkTheme);
    tick(200);
    expect(service.currentTheme().value).toBe(mockDarkTheme.value);

    // Then remove mockDarkTheme from available themes
    dynamicConfigMock.setSystemThemes([mockLightTheme]);

    // Wait for effect to run and debounce to complete
    tick(200);

    // Since Angular effects in tests may not run automatically,
    // we need to manually force a refresh of the theme service state
    // in the test environment
    service.refreshTheme();

    // Allow time for refreshTheme to complete
    tick(200);

    // Now check if theme was reset to mockLightTheme
    expect(service.currentTheme().value).toBe(mockLightTheme.value);
  }));

  //- - - - - - - - - - - - - - -//

  it('should keep current theme when it still exists in available themes', fakeAsync(() => {
    service.setTheme(mockDarkTheme);
    tick(100);
    expect(service.currentTheme().value).toBe(mockDarkTheme.value);

    const newThemes = [mockLightTheme, mockDarkTheme, mockCustomTheme];
    dynamicConfigMock.setSystemThemes(newThemes);

    tick(0);

    expect(service.currentTheme().value).toBe(mockDarkTheme.value);
  }));

  //- - - - - - - - - - - - - - -//

  it('should not reset current theme if it exists in custom themes', fakeAsync(() => {
    service.addCustomTheme(mockDarkTheme);
    tick(100);

    service.setTheme(mockDarkTheme);
    tick(100);

    dynamicConfigMock.setSystemThemes([mockLightTheme]);
    tick(0);

    expect(service.currentTheme().value).toBe(mockDarkTheme.value);
  }));

  //- - - - - - - - - - - - - - -//


  it('should reapply the current theme when reapplyCurrentTheme is called', () => {
    // Arrange
    const mockTheme: ThemeOption = {
      value: 'test-theme',
      label: 'Test Theme',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      tertiaryColor: '#05ff00',
      errorColor: '#05ff66',
       darkMode: 'light'
    };

    // Set up spies and mocks
    jest.spyOn(service, 'currentTheme').mockReturnValue(mockTheme);
    themeGeneratorMock.applyTheme.mockClear();

    // Act
    service.reapplyCurrentTheme();

    // Assert
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(
      mockTheme,
      mockTheme.value,
      undefined
    );
  });

  //- - - - - - - - - - - - - - -//


  it('should correctly delegate to ThemeGeneratorService when reapplying the current theme', fakeAsync(() => {
    // Arrange
    const mockTheme: ThemeOption = {
      value: 'current-theme',
      label: 'Current Theme',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      tertiaryColor: '#05ff00',
      errorColor: '#05ff66',
       darkMode: 'light'
    };

    // Mock the current theme and reset the call count
    jest.spyOn(service, 'currentTheme').mockReturnValue(mockTheme);
    themeGeneratorMock.applyTheme.mockClear();

    // Act
    service.reapplyCurrentTheme();

    // Assert - verify ThemeGeneratorService is called with correct parameters
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(
      mockTheme,
      mockTheme.value,
      undefined
    );

    // Verify no theme transitions were triggered (since we're just reapplying)
    expect(themeTransitionMock.transitionThemes).not.toHaveBeenCalled();
  }));

  //- - - - - - - - - - - - - - -//
});