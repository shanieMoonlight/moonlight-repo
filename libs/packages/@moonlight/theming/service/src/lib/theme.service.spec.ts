import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { ThemeService } from './theme.service';
import { SsrLocalStorage } from '../../../../ssr/storage/src/index';
import { SytemPrefsService } from './generator/utils/sytem-prefs/sytem-prefs.service';
import { ThemeConfig, ThemeConfigService, ThemeOption, ThemeValue, defaultThemeOption, DarkModeType } from '../../../config/src/index';
import { ThemeGeneratorService } from './generator/theme-generator.service';
import { ThemeData, ThemeDataUtils } from './theme-data';

// Mocks
const mockDefaultTheme: ThemeOption = ThemeOption.create({ ...defaultThemeOption, value: 'default-light', label: 'Default Light', darkMode: false });
const mockDarkTheme: ThemeOption = ThemeOption.create({ value: 'system-dark', label: 'System Dark', darkMode: true, primaryColor: '#000000', secondaryColor: '#ffffff' });
const mockLightTheme: ThemeOption = ThemeOption.create({ value: 'system-light', label: 'System Light', darkMode: false, primaryColor: '#ffffff', secondaryColor: '#000000' });
const mockCustomTheme: ThemeOption = ThemeOption.create({ value: 'custom-blue', label: 'Custom Blue', darkMode: false, primaryColor: '#0000ff', secondaryColor: '#ffffff' });

class MockSsrLocalStorage {
  getItemObject = jest.fn();
  setItemObject = jest.fn();
  removeItem = jest.fn();
}

class MockSytemPrefsService {
  prefersDarkMode$ = new BehaviorSubject<boolean>(false); // Default to light
}

class MockThemeGeneratorService {
  applyTheme = jest.fn();
}

class MockDestroyRef extends DestroyRef {
  onDestroy = jest.fn();
  constructor() { super(); }
}

describe('ThemeService Initialization and Core Logic', () => {
  let service: ThemeService;
  let localStorageMock: MockSsrLocalStorage;
  let themeConfigMock: ThemeConfig;
  let themeGeneratorMock: MockThemeGeneratorService;
  let systemPrefsMock: MockSytemPrefsService;
  let destroyRefMock: MockDestroyRef;

  const createMockThemeConfig = (overrides?: Partial<ThemeConfig>): ThemeConfig => {
    const config = ThemeConfig.create();
    config.themeOptions = [mockLightTheme, mockDarkTheme];
    config.defaultDarkMode = 'light';
    if (overrides) {
      Object.assign(config, overrides);
    }
    return config;
  };

  const setupTestBed = (configOverrides?: Partial<ThemeConfig>, storageData?: ThemeData | null | 'error') => {
    themeConfigMock = createMockThemeConfig(configOverrides);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: SsrLocalStorage, useClass: MockSsrLocalStorage },
        { provide: SytemPrefsService, useClass: MockSytemPrefsService },
        { provide: ThemeConfigService, useValue: themeConfigMock },
        { provide: ThemeGeneratorService, useClass: MockThemeGeneratorService },
        { provide: DestroyRef, useClass: MockDestroyRef },
      ],
    });

    localStorageMock = TestBed.inject(SsrLocalStorage) as unknown as MockSsrLocalStorage;
    themeConfigMock = TestBed.inject(ThemeConfigService);
    themeGeneratorMock = TestBed.inject(ThemeGeneratorService) as unknown as MockThemeGeneratorService;
    systemPrefsMock = TestBed.inject(SytemPrefsService) as unknown as MockSytemPrefsService;
    destroyRefMock = TestBed.inject(DestroyRef) as unknown as MockDestroyRef;

    // Mock localStorage retrieval
    if (storageData === 'error') {
      localStorageMock.getItemObject.mockImplementation(() => {
        throw new SyntaxError("Invalid JSON");
      });
    } else {
      // Ensure getItemObject is mocked correctly *before* the service is created
      localStorageMock.getItemObject.mockReturnValue(storageData === undefined ? null : storageData);
    }

    // Spy on internal methods *before* service creation if needed
    jest.spyOn(ThemeService.prototype as any, 'setDefaultTheme');
    jest.spyOn(console, 'error').mockImplementation(() => { });

    service = TestBed.inject(ThemeService);
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default theme when localStorage is empty', fakeAsync(() => {
    setupTestBed();

    tick(100); // Advance time for debounceTime

    expect(service.currentTheme()).toEqual(themeConfigMock.themeOptions[0]);
    expect((service as any)._isDarkModeBs.value).toEqual(themeConfigMock.themeOptions[0].darkMode);
    expect(service.customThemes()).toEqual([]);
    expect(localStorageMock.getItemObject).toHaveBeenCalledWith('moonlight_theme_key');
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalled();
    expect(localStorageMock.setItemObject).toHaveBeenCalled();
    expect((service as any).setDefaultTheme).not.toHaveBeenCalled();
  }));

  it('should initialize with stored theme data from localStorage', fakeAsync(() => {
    const storedData: ThemeData = ThemeDataUtils.create(
        { ...mockDarkTheme, darkMode: true },
        [mockCustomTheme]
    );
    setupTestBed(undefined, storedData);

    tick(100);

    expect(service.currentTheme()).toEqual(storedData.currentTheme);
    expect((service as any)._isDarkModeBs.value).toEqual(storedData.currentTheme.darkMode);
    expect(service.customThemes()).toEqual(storedData.customThemes);
    expect(localStorageMock.getItemObject).toHaveBeenCalledWith('moonlight_theme_key');
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(expect.objectContaining({ ...storedData.currentTheme, darkMode: true }), undefined, undefined);
    const expectedStoredData = ThemeDataUtils.create({ ...storedData.currentTheme, darkMode: true }, storedData.customThemes);
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

    expect((service as any)._isDarkModeBs.value).toEqual('system');
    systemPrefsMock.prefersDarkMode$.next(true);
    tick();
    expect(service.isDarkMode()).toBe(true);

    systemPrefsMock.prefersDarkMode$.next(false);
    tick();
    expect(service.isDarkMode()).toBe(false);
  }));

  it('should initialize dark mode based on config default if stored theme lacks darkMode property', fakeAsync(() => {
    const storedData: ThemeData = {
      currentTheme: { value: 'some-theme', label: 'Some Theme' } as any,
      customThemes: [],
    };
    setupTestBed({ defaultDarkMode: 'dark' }, storedData);

    tick(100);

    expect((service as any)._isDarkModeBs.value).toBe(true);
    expect(service.isDarkMode()).toBe(true);
  }));

  it('should handle SyntaxError during theme retrieval and set defaults', fakeAsync(() => {
    setupTestBed(undefined, 'error');

    expect(console.error).toHaveBeenCalled();
    expect((service as any).setDefaultTheme).toHaveBeenCalledTimes(1);

    const defaultTheme = themeConfigMock.themeOptions[0] ?? defaultThemeOption;
    expect(service.currentTheme()).toEqual(defaultTheme);
    expect((service as any)._isDarkModeBs.value).toEqual(defaultTheme.darkMode);

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
        { provide: SytemPrefsService, useClass: MockSytemPrefsService },
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
    expect((service as any)._isDarkModeBs.value).toEqual(defaultTheme.darkMode);

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

    service.setDarkMode(true);
    tick(100);

    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledTimes(3);
    expect(localStorageMock.setItemObject).toHaveBeenCalledTimes(3);
    const expectedDarkModeChangeData = ThemeDataUtils.create({ ...mockDarkTheme, darkMode: true }, []);
    expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(expectedDarkModeChangeData.currentTheme, undefined, undefined);
    expect(localStorageMock.setItemObject).toHaveBeenCalledWith('moonlight_theme_key', expectedDarkModeChangeData);
  }));

});