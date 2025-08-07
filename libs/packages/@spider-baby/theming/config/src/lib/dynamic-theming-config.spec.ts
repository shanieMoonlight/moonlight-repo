import { TestBed } from '@angular/core/testing';
import { DynamicThemeConfigService } from './dynamic-theming-config';
import { ThemeConfigService, ThemingConfig } from './theming-config';
import { ThemeOption, DarkModeType } from './theme-options';
import { ThemeTransitionOptions, DEFAULT_TRANSITION_OPTIONS } from './theme-transition-options';

describe('DynamicThemeConfigService', () => {
  let service: DynamicThemeConfigService;
  let initialThemeOptions: ThemeOption[];
  let mockInitialConfig: ThemingConfig;

  beforeEach(() => {
    // Create initial mock themes
    initialThemeOptions = [
      ThemeOption.create({
        value: 'initial-theme-1',
        label: 'Initial Theme 1',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00'
      }),
      ThemeOption.create({
        value: 'initial-theme-2',
        label: 'Initial Theme 2',
        primaryColor: '#0000FF', 
        secondaryColor: '#FFFF00'
      })
    ];

    // Create mock initial config
    mockInitialConfig = ThemingConfig.create({
      themeOptions: initialThemeOptions,
      defaultDarkModeType: 'light',
      themeClassPrefix: 'test-theme',
      darkModeClass: 'test-dark',
      transitionOptions: {
        showTransitions: true,
        style: 'morph',
        duration: 300
      }
    });

    TestBed.configureTestingModule({
      providers: [
        DynamicThemeConfigService,
        { provide: ThemeConfigService, useValue: mockInitialConfig }
      ]
    });

    service = TestBed.inject(DynamicThemeConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with themes from ThemeConfigService', () => {
    // Check the initial value of systemThemes
    expect(service.systemThemes()).toEqual(initialThemeOptions);
    
    // Also check that systemThemes$ emits the correct initial value
    let emittedThemes: ThemeOption[] | undefined;
    service.systemThemes$.subscribe(themes => {
      emittedThemes = themes;
    });
    
    expect(emittedThemes).toEqual(initialThemeOptions);
  });

  it('should update systemThemes when setSystemThemes is called', () => {
    // Create new themes to set
    const newThemes = [
      ThemeOption.create({
        value: 'new-theme',
        label: 'New Theme',
        primaryColor: '#123456',
        secondaryColor: '#654321'
      })
    ];

    // Call the method
    service.setSystemThemes(newThemes);
    
    // Verify signal was updated
    expect(service.systemThemes()).toEqual(newThemes);
    
    // Verify observable emits new value
    let emittedThemes: ThemeOption[] | undefined;
    service.systemThemes$.subscribe(themes => {
      emittedThemes = themes;
    });
    
    expect(emittedThemes).toEqual(newThemes);
  });

  it('should add a single theme when addSystemTheme is called', () => {
    // Create a new theme to add
    const newTheme = ThemeOption.create({
      value: 'another-theme',
      label: 'Another Theme',
      primaryColor: '#ABCDEF',
      secondaryColor: '#FEDCBA'
    });

    // Call the method
    service.addSystemTheme(newTheme);
    
    // Verify signal now contains original themes plus new theme
    const updatedThemes = service.systemThemes();
    expect(updatedThemes.length).toBe(initialThemeOptions.length + 1);
    expect(updatedThemes).toContainEqual(newTheme);
    
    // Ensure original themes are still there
    initialThemeOptions.forEach(theme => {
      expect(updatedThemes).toContainEqual(theme);
    });
  });

  it('should not add duplicate themes in addSystemTheme', () => {
    // Try to add the first initial theme again
    const duplicateTheme = ThemeOption.create({
      ...initialThemeOptions[0],
      label: 'Changed Label But Same Value' // Different label, same value
    });

    // Call the method
    service.addSystemTheme(duplicateTheme);
    
    // Verify length didn't change
    expect(service.systemThemes().length).toBe(initialThemeOptions.length);
  });

  it('should reset to initial themes when resetSystemThemesToInitial is called', () => {
    // First change the themes
    const newThemes = [
      ThemeOption.create({
        value: 'temporary-theme',
        label: 'Temporary Theme',
        primaryColor: '#111111',
        secondaryColor: '#222222'
      })
    ];
    
    service.setSystemThemes(newThemes);
    
    // Verify it changed
    expect(service.systemThemes()).toEqual(newThemes);
    
    // Now reset
    service.resetSystemThemesToInitial();
    
    // Verify it reset to initial themes
    expect(service.systemThemes()).toEqual(initialThemeOptions);
  });

  // Updated test to properly check signal values
  it('should initialize with correct config properties as signals', () => {
    // Check that signals return the correct initial values
    expect(service.defaultDarkModeType()).toBe(mockInitialConfig.defaultDarkModeType);
    expect(service.themeClassPrefix()).toBe(mockInitialConfig.themeClassPrefix);
    expect(service.darkModeClass()).toBe(mockInitialConfig.darkModeClass);
    expect(service.transitionOptions()).toEqual(mockInitialConfig.transitionOptions);
  });

  // New tests for update methods
  it('should update defaultDarkMode when setDefaultDarkMode is called', () => {
    const newDarkMode: DarkModeType = 'dark';
    
    // Call the method
    service.setDefaultDarkMode(newDarkMode);
    
    // Check signal was updated
    expect(service.defaultDarkModeType()).toBe(newDarkMode);
    
    // Check observable emits new value
    let emittedValue: DarkModeType | undefined;
    service.defaultDarkModeType$.subscribe(value => {
      emittedValue = value;
    });
    
    expect(emittedValue).toBe(newDarkMode);
  });

  it('should update darkModeClass when setDarkModeClass is called', () => {
    const newClass = 'new-dark-class';
    
    service.setDarkModeClass(newClass);
    
    expect(service.darkModeClass()).toBe(newClass);
  });


  it('should update themeClassPrefix when setThemeClassPrefix is called', () => {
    const newPrefix = 'new-prefix';
    
    service.setThemeClassPrefix(newPrefix);
    
    expect(service.themeClassPrefix()).toBe(newPrefix);
  });

  it('should update transitionOptions when setTransitionOptions is called', () => {
    const newOptions: ThemeTransitionOptions = {
      showTransitions: false,
      style: 'overlay',
      duration: 500
    };
    
    service.setTransitionOptions(newOptions);
    
    expect(service.transitionOptions()).toEqual(newOptions);
  });

  it('should reset all properties when resetAllToInitial is called', () => {
    // First change everything
    service.setSystemThemes([]);
    service.setDefaultDarkMode('dark');
    service.setDarkModeClass('changed-dark');
    service.setThemeClassPrefix('changed-prefix');
    service.setTransitionOptions(DEFAULT_TRANSITION_OPTIONS);
    
    // Verify changes took effect
    expect(service.systemThemes().length).toBe(0);
    expect(service.defaultDarkModeType()).toBe('dark');
    
    // Now reset all
    service.resetAllToInitial();
    
    // Verify everything is back to initial values
    expect(service.systemThemes()).toEqual(initialThemeOptions);
    expect(service.defaultDarkModeType()).toBe(mockInitialConfig.defaultDarkModeType);
    expect(service.darkModeClass()).toBe(mockInitialConfig.darkModeClass);
    expect(service.themeClassPrefix()).toBe(mockInitialConfig.themeClassPrefix);
    expect(service.transitionOptions()).toEqual(mockInitialConfig.transitionOptions);
  });
});