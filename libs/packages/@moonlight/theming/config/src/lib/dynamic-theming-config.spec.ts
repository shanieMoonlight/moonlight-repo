import { TestBed } from '@angular/core/testing';
import { DynamicThemeConfigService } from './dynamic-theming-config';
import { ThemeConfigService, ThemingConfig } from './theming-config';
import { ThemeOption } from './theme-options';

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
      defaultMode: 'light',
      themeClassPrefix: 'test-theme'
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

  it('should preserve static config properties', () => {
    // Check that other properties from the initial config are preserved
    expect(service.themeClassPrefix).toBe(mockInitialConfig.themeClassPrefix);
    expect(service.defaultDarkMode).toBe(mockInitialConfig.defaultDarkMode);
  });
});