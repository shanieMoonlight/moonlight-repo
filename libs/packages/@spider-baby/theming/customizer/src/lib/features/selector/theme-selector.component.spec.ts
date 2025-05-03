import { PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThemeConfigService, ThemeOption, ThemingConfig } from '@spider-baby/material-theming/config';
import { ScssPaletteGeneratorService, ThemeService } from '@spider-baby/material-theming/service';
import { MockBuilder, MockRender } from 'ng-mocks';
import { of } from 'rxjs';
import { ScssDisplayComponent } from '../../ui/scss-display.component';
import { MlCustomThemeManagerComponent } from "../custom-theme-mgr/custom-theme-mgr.component";
import { MlCustomThemeSavedComponent } from '../theme-saved/theme-saved.component';
import { SbThemeSelectorComponent } from './theme-selector.component';

describe('SbThemeSelectorComponent', () => {
  let component: SbThemeSelectorComponent;
  let themeServiceMock: jest.Mocked<ThemeService>;
  let dialogMock: jest.Mocked<MatDialog>;

  const mockPreset = {
    value: 'preset1',
    label: 'Preset 1',
    primaryColor: '#ff0000',
    secondaryColor: '#00ff00'
  } as ThemeOption;

  // Create a full ThemeConfig object
  const mockConfig = ThemingConfig.create().setSelectorPresetThemes([mockPreset]);

  let scssPaletteGeneratorMock: jest.Mocked<ScssPaletteGeneratorService> =


    beforeEach(() => {


      // Initialize in beforeEach:
      scssPaletteGeneratorMock = {
        exportThemeAsScss: jest.fn().mockReturnValue('')
      } as unknown as jest.Mocked<ScssPaletteGeneratorService>;

      themeServiceMock = {
        addCustomTheme: jest.fn(),
        currentTheme: jest.fn().mockReturnValue(null),
        customThemes$: of([]),
        reapplyCurrentTheme: jest.fn(),
        applyTheme: jest.fn()
      } as unknown as jest.Mocked<ThemeService>;

      dialogMock = {
        open: jest.fn().mockReturnValue({
          afterClosed: () => of(true)
        })
      } as unknown as jest.Mocked<MatDialog>;
      // Use MockBuilder to properly handle module imports 
      // and override providers from imported modules
      return MockBuilder(SbThemeSelectorComponent)
        // Keep ReactiveFormsModule real
        .keep(ReactiveFormsModule)
        // Mock everything else but provide our mocks
        .provide({ provide: ThemeService, useValue: themeServiceMock })
        .provide({ provide: MatDialog, useValue: dialogMock })
        .provide({ provide: ThemeConfigService, useValue: mockConfig })
        .provide({ provide: ScssPaletteGeneratorService, useValue: scssPaletteGeneratorMock })
        .provide({ provide: PLATFORM_ID, useValue: 'browser' });
    });


  beforeEach(() => {
    const fixture = MockRender(SbThemeSelectorComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should preview a theme when form is valid', () => {
    // Arrange
    const form = component['_themeForm'];
    form.setValue({
      themeName: 'Test Theme',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      tertiaryColor: '#0000ff',
      errorColor: '#ffff00',
      darkMode: 'system'
    });

    // Act
    component['previewFormTheme'](form);

    // Assert - focus on observable outcome
    expect(themeServiceMock.applyTheme).toHaveBeenCalled();

    const themeArg = themeServiceMock.applyTheme.mock.calls[0][0];
    expect(themeArg.label).toBe('Test Theme');
    expect(themeArg.primaryColor).toBe('#ff0000');
    expect(themeArg.secondaryColor).toBe('#00ff00');

    // Check that preview theme was set in signal
    expect(component['_generatorPreviewTheme']()).not.toBeNull();
  });

  it('should not preview theme when form is invalid', () => {
    // Arrange
    const form = component['_themeForm'];
    form.get('themeName')?.setValue(''); // Invalid - required field

    // Set up the spy BEFORE calling the method that uses console.warn
    const consoleSpy = jest.spyOn(console, 'warn');

    // Act
    component['previewFormTheme'](form);

    // Assert
    expect(themeServiceMock.applyTheme).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));
  });

  it('should update form and preview when selecting preset theme', () => {
    // Arrange
    const presetTheme = mockPreset;

    // Act
    component['previewPresetTheme'](presetTheme);

    // Assert - verify form was updated with preset values
    const form = component['_themeForm'];
    expect(form.get('primaryColor')?.value).toBe(presetTheme.primaryColor);
    expect(form.get('secondaryColor')?.value).toBe(presetTheme.secondaryColor);

    // Verify theme was applied
    // Instead of checking if DOM elements were modified,
    // verify that the service was called with correct arguments:
    expect(themeServiceMock.applyTheme).toHaveBeenCalledWith(
      expect.objectContaining({ value: presetTheme.value })
    );
  });

  it('should restore application theme on component destroy', () => {

    // Act
    component.ngOnDestroy();

    // Assert - verify original theme was restored
    expect(themeServiceMock.reapplyCurrentTheme).toHaveBeenCalledWith();
  });

  it('should open dialog when saving a custom theme', () => {
    // Arrange
    const theme = { value: 'custom', primaryColor: '#aabbcc' } as ThemeOption;

    // Act
    component['storeTheme'](theme);

    // Assert
    // Check theme was added to service
    expect(themeServiceMock.addCustomTheme).toHaveBeenCalledWith(theme);

    // Check confirmation dialog was shown
    expect(dialogMock.open).toHaveBeenCalledWith(
      MlCustomThemeSavedComponent,
      expect.objectContaining({
        data: { theme }
      })
    );
  });

  it('should export theme as SCSS and show dialog', () => {
    // Arrange
    const theme = { value: 'export-test' } as ThemeOption;
    const scssContent = '.test { color: red; }';
    scssPaletteGeneratorMock.exportThemeAsScss.mockReturnValue(scssContent);

    // Act
    component['openScssDialog'](theme);

    // Assert
    expect(scssPaletteGeneratorMock.exportThemeAsScss).toHaveBeenCalledWith(theme);
    expect(dialogMock.open).toHaveBeenCalledWith(
      ScssDisplayComponent,
      expect.objectContaining({
        data: { scssContent }
      })
    );

    // Verify content is stored in signal
    expect(component['_exportedScss']()).toBe(scssContent);
  });

  it('should open theme manager dialog', () => {
    // Act
    component['manageCustomThemes']();

    // Assert
    expect(dialogMock.open).toHaveBeenCalledWith(
      MlCustomThemeManagerComponent,
      expect.anything()
    );
  });

  it('should not perform operations when not in browser context', () => {
    // Arrange - mock non-browser environment
    const isBrowserSpy = jest.spyOn(component as any, 'isBrowser').mockReturnValue(false);
    const theme = { value: 'test' } as ThemeOption;

    // Act
    component['previewTheme'](theme);
    component['openScssDialog'](theme);
    component['manageCustomThemes']();

    // Assert - verify no operations happened
    expect(themeServiceMock.applyTheme).not.toHaveBeenCalled();
    expect(scssPaletteGeneratorMock.exportThemeAsScss).not.toHaveBeenCalled();
    expect(dialogMock.open).not.toHaveBeenCalled();

    // Restore original implementation
    isBrowserSpy.mockRestore();
  });
});