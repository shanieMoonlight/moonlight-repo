import { DestroyRef } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DarkModeType, DynamicThemeConfigService, ThemeOption } from '@spider-baby/material-theming/config';
import { SsrLocalStorage } from '@spider-baby/ssr-storage';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SbThemeGeneratorService } from './generator/theme-generator.service';
import { SystemPrefsService } from './generator/utils/sytem-prefs/sytem-prefs.service';
import { ThemeData } from './theme-data';
import { ThemeTransitionService } from './transitions/transitions.service';
import { SbThemeService } from './theme.service';

describe('SbThemeService', () => {
  let service: SbThemeService;
  let localStorageMock: {
    getItemObject: jest.Mock;
    setItemObject: jest.Mock;
    removeItem: jest.Mock
  };
  let systemPrefsMock: {
    prefersDarkMode: jest.Mock;
    prefersDarkMode$: Observable<boolean>;
  };
  let darkModePrefSubject: BehaviorSubject<boolean>;
  let configServiceMock: {
    systemThemes: jest.Mock;
    systemThemes$: Observable<ThemeOption[]>;
    defaultDarkModeType: jest.Mock;
    transitionOptions: jest.Mock;
  };
  let themeGeneratorMock: {
    applyTheme: jest.Mock
  };
  let themeTransitionMock: {
    transitionThemes: jest.Mock
  };
  let destroyRefMock: {
    onDestroy: jest.Mock
  };

  const mockDefaultDarkMode: DarkModeType = 'system';

  const mockThemes: ThemeOption[] = [
    ThemeOption.create({
      darkMode: 'system',
      label: 'Default',
      value: 'default',
      primaryColor: '#4682B4',
      secondaryColor: '#D2691E',
    }),
    ThemeOption.create({
      darkMode: 'light',
      label: 'Violet',
      value: 'violet',
      primaryColor: '#8A2BE2',
      secondaryColor: '#32CD32',
    })
  ];

  const mockThemeData: ThemeData = {
    currentTheme: mockThemes[0],
    customThemes: []
  };

  beforeEach(() => {
    darkModePrefSubject = new BehaviorSubject<boolean>(false);

    localStorageMock = {
      getItemObject: jest.fn().mockReturnValue(mockThemeData),
      setItemObject: jest.fn(),
      removeItem: jest.fn()
    };

    systemPrefsMock = {
      prefersDarkMode: jest.fn().mockReturnValue(false),
      prefersDarkMode$: darkModePrefSubject.asObservable()
    };

    configServiceMock = {
      systemThemes: jest.fn().mockReturnValue(mockThemes),
      systemThemes$: of(mockThemes),
      defaultDarkModeType: jest.fn().mockReturnValue(mockDefaultDarkMode),
      transitionOptions: jest.fn().mockReturnValue({ showTransitions: false })
    };

    themeGeneratorMock = {
      applyTheme: jest.fn()
    };

    themeTransitionMock = {
      transitionThemes: jest.fn()
    };

    destroyRefMock = {
      onDestroy: jest.fn(fn => fn())
    };

    TestBed.configureTestingModule({
      providers: [
        SbThemeService,
        { provide: SsrLocalStorage, useValue: localStorageMock },
        { provide: SystemPrefsService, useValue: systemPrefsMock },
        { provide: DynamicThemeConfigService, useValue: configServiceMock },
        { provide: SbThemeGeneratorService, useValue: themeGeneratorMock },
        { provide: ThemeTransitionService, useValue: themeTransitionMock },
        { provide: DestroyRef, useValue: destroyRefMock }
      ]
    });

    service = TestBed.inject(SbThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load theme data from localStorage on initialization', () => {
      expect(localStorageMock.getItemObject).toHaveBeenCalledWith('spider-baby_theme_key');
    });

    it('should set current theme from stored data', () => {
      expect(service.currentTheme()).toEqual(mockThemeData.currentTheme);
    });

    it('should fallback to default theme if localStorage returns null', () => {
      localStorageMock.getItemObject.mockReturnValueOnce(null);
      service = TestBed.inject(SbThemeService);

      expect(service.currentTheme()).toEqual(mockThemes[0]);
    });

    it('should handle errors during initialization by falling back to defaults', () => {
      localStorageMock.getItemObject.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      service = TestBed.inject(SbThemeService);

      expect(service.currentTheme()).toEqual(mockThemes[0]);
    });
  });

  describe('setDarkMode', () => {
    it('should update the dark mode type', fakeAsync(() => {
      service.setDarkMode('dark');
      tick();

      // Access the BehaviorSubject directly instead of the signal
      service.darkModeType$.subscribe(value => {
        expect(value).toBe('dark');
      });
    }));

    it('should handle null value by using system default', fakeAsync(() => {
      const mockDefaultDarkMode = 'system';
      configServiceMock.defaultDarkModeType.mockReturnValue(mockDefaultDarkMode);

      service.setDarkMode(null);
      tick();

      // Access the BehaviorSubject directly instead of the signal
      service.darkModeType$.subscribe(value => {
        expect(value).toBe(mockDefaultDarkMode);
      });
    }));
  });

  describe('setTheme', () => {
    it('should update the current theme', fakeAsync(() => {
      service.setTheme(mockThemes[1]);
      tick();

      expect(service.currentTheme()).toEqual(mockThemes[1]);
    }));

    it('should handle null value by using default theme', fakeAsync(() => {
      service.setTheme(null);
      tick();

      expect(service.currentTheme()).toEqual(mockThemes[0]);
    }));
  });

  describe('setThemeByValue', () => {
    it('should set theme by its value if it exists', fakeAsync(() => {
      const result = service.setThemeByValue('violet');
      tick();

      expect(result).toBe(true);
      expect(service.currentTheme()).toEqual(mockThemes[1]);
    }));

    it('should return false if theme with value does not exist', fakeAsync(() => {
      const result = service.setThemeByValue('non-existent');
      tick();

      expect(result).toBe(false);
      expect(service.currentTheme()).not.toEqual({ value: 'non-existent' });
    }));
  });

  describe('applyTheme', () => {
    it('should call themeGenerator.applyTheme with correct parameters', () => {
      const theme = mockThemes[0];
      const targetElement = {} as HTMLElement;

      service.applyTheme(theme, targetElement);

      expect(themeGeneratorMock.applyTheme).toHaveBeenCalledWith(
        theme, theme.value, targetElement
      );
    });

    it('should not call themeGenerator.applyTheme if theme is null', () => {
      service.applyTheme(null as any);

      expect(themeGeneratorMock.applyTheme).not.toHaveBeenCalled();
    });
  });

  describe('addCustomTheme', () => {
    const customTheme = ThemeOption.create({
      darkMode: 'light',
      label: 'Custom',
      value: 'custom',
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00'
    });

    it('should add a custom theme to the list', fakeAsync(() => {
      service.addCustomTheme(customTheme);
      tick();

      expect(service.customThemes()).toContainEqual(
        expect.objectContaining({ value: 'custom-custom' })
      );
    }));

    it('should sanitize theme value', fakeAsync(() => {
      const themeWithSpaces = ThemeOption.create({
        ...customTheme,
        value: 'My Custom Theme!'
      });

      service.addCustomTheme(themeWithSpaces);
      tick();

      expect(service.customThemes()[0].value).toBe('custom-my-custom-theme');
    }));

    it('should update an existing custom theme with the same value', fakeAsync(() => {
      // Add initial theme
      service.addCustomTheme(customTheme);
      tick();

      // Update theme with same value but different color
      const updatedTheme = ThemeOption.create({
        ...customTheme,
        primaryColor: '#0000FF'
      });

      service.addCustomTheme(updatedTheme);
      tick();

      expect(service.customThemes().length).toBe(1);
      expect(service.customThemes()[0].primaryColor).toBe('#0000FF');
    }));
  });

  describe('removeCustomTheme', () => {
    it('should remove a custom theme by value', fakeAsync(() => {
      // Add some custom themes first
      const customTheme1 = ThemeOption.create({
        darkMode: 'light',
        label: 'Custom1',
        value: 'custom1',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00'
      });

      const customTheme2 = ThemeOption.create({
        darkMode: 'dark',
        label: 'Custom2',
        value: 'custom2',
        primaryColor: '#0000FF',
        secondaryColor: '#FFFF00'
      });

      service.addCustomTheme(customTheme1);
      service.addCustomTheme(customTheme2);
      tick();

      // Remove one theme
      service.removeCustomTheme('custom-custom1');
      tick();

      expect(service.customThemes().length).toBe(1);
      expect(service.customThemes()[0].value).toBe('custom-custom2');
    }));
  });

  describe('resetToDefaults', () => {
    it('should clear custom themes', fakeAsync(() => {
      // Add a custom theme first
      const customTheme = ThemeOption.create({
        darkMode: 'light',
        label: 'Custom',
        value: 'custom',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00'
      });

      service.addCustomTheme(customTheme);
      tick();

      // Reset
      service.resetToDefaults();
      tick();

      expect(service.customThemes().length).toBe(0);
    }));

    it('should reset to first system theme', fakeAsync(() => {
      // First set a different theme
      service.setTheme(mockThemes[1]);
      tick();

      // Then reset
      service.resetToDefaults();
      tick();

      expect(service.currentTheme()).toEqual(mockThemes[0]);
    }));

    it('should clear localStorage', () => {
      service.resetToDefaults();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('spider-baby_theme_key');
    });
  });

  describe('refreshTheme', () => {
    it('should call applyTheme with current theme', fakeAsync(() => {
      const protoSpy = jest.spyOn(SbThemeService.prototype as any, 'applyStoredThemeData').mockImplementation(() => { });
      service.refreshTheme();
      expect(protoSpy).toHaveBeenCalled();
      protoSpy.mockRestore();
    }));
  });

  describe('isDarkMode', () => {
    it('should return true when darkMode is dark', fakeAsync(() => {
      service.setDarkMode('dark');
      tick();

      expect(service.isDarkMode()).toBe(true);
    }));

    it('should return false when darkMode is light', fakeAsync(() => {
      service.setDarkMode('light');
      tick();

      expect(service.isDarkMode()).toBe(false);
    }));

    it('should return system preference when darkMode is system', fakeAsync(() => {
      service.setDarkMode('system');
      tick();

      // Default mock is false (light mode)
      expect(service.isDarkMode()).toBe(false);

      // Change system preference - use the subject directly instead of casting
      darkModePrefSubject.next(true);
      tick();

      expect(service.isDarkMode()).toBe(true);
    }));
  });

  describe('exportThemeSettings', () => {
    it('should return current theme and dark mode status', fakeAsync(() => {
      service.setTheme(mockThemes[1]);
      service.setDarkMode('dark');
      tick();

      const result = service.exportThemeSettings();

      expect(result).toEqual({
        theme: mockThemes[1],
        isDark: true
      });
    }));
  });
});