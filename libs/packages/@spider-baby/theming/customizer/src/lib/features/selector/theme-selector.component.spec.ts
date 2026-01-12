import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SbThemeSelectorComponent } from './theme-selector.component';
import { PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScssPaletteGeneratorService, SbThemeService } from '@spider-baby/material-theming/service';
import { ThemeConfigService } from '@spider-baby/material-theming/config';

describe('SbThemeSelectorComponent', () => {
  let fixture: ComponentFixture<SbThemeSelectorComponent>;
  let component: SbThemeSelectorComponent;

  const mockThemeService = {
    customThemes$: of([]),
    applyTheme: jest.fn(),
    addCustomTheme: jest.fn(),
    refreshTheme: jest.fn()
  } as unknown as SbThemeService;

  const mockScss = {
    exportThemeAsScss: jest.fn()
  } as unknown as ScssPaletteGeneratorService;

  const mockDialog = {
    open: jest.fn()
  } as unknown as MatDialog;

  const mockConfig = {
    presetCustomizerThemes: [
      {
        value: 'one',
        label: 'One',
        primaryColor: '#ffffff',
        secondaryColor: '#000000',
        tertiaryColor: '#cccccc',
        errorColor: '#ff0000',
        darkMode: 'light'
      }
    ]
  } as unknown as ThemeConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // SbThemeSelectorComponent is standalone in Angular v21 — import it instead of declaring
      imports: [ReactiveFormsModule, SbThemeSelectorComponent],
      providers: [
        { provide: SbThemeService, useValue: mockThemeService },
        { provide: ScssPaletteGeneratorService, useValue: mockScss },
        { provide: ThemeConfigService, useValue: mockConfig },
        { provide: MatDialog, useValue: mockDialog },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SbThemeSelectorComponent);
    component = fixture.componentInstance;
    // ensure component uses our mock dialog (prevent Angular Material creating real overlay)
    (component as any)._dialog = mockDialog;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('toTheme returns ThemeOption with safe hyphenated value', () => {
    const tf = (component as any)._themeForm;
    tf.controls.themeName.setValue('My Fancy Theme');
    const result = (component as any).toTheme(tf);
    expect(result).toBeDefined();
    expect(result.value).toBe('my-fancy-theme');
    expect(result.label).toBe('My Fancy Theme');
  });

  it('previewPresetTheme patches the form and applies theme', () => {
    const preset = mockConfig.presetCustomizerThemes[0] as any;
    (component as any).previewPresetTheme(preset);
    expect((component as any)._themeForm.controls.themeName.value).toBe(preset.value);
    expect(mockThemeService.applyTheme).toHaveBeenCalledWith(preset);
  });

  it('previewFormTheme does not apply when form invalid', () => {
    (component as any)._themeForm.controls.themeName.setValue('');
    (component as any).previewFormTheme((component as any)._themeForm);
    expect(mockThemeService.applyTheme).not.toHaveBeenCalled();
  });

  it('previewFormTheme applies valid form and sets generator preview', () => {
    const tf = (component as any)._themeForm;
    tf.controls.themeName.setValue('My Test');
    tf.controls.primaryColor.setValue('#112233');
    tf.controls.secondaryColor.setValue('#445566');
    (component as any).previewFormTheme(tf);
    expect(mockThemeService.applyTheme).toHaveBeenCalled();
    const preview = (component as any)._generatorPreviewTheme();
    expect(preview).toBeTruthy();
    expect(preview.label).toBe('My Test');
  });

  it('storeTheme calls addCustomTheme and opens saved dialog', () => {
    const theme = { value: 't', label: 'T' } as any;
    (component as any).storeTheme(theme);
    expect(mockThemeService.addCustomTheme).toHaveBeenCalledWith(theme);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('openScssDialog opens dialog when scss returned', () => {
    const theme = { value: 't', label: 'T' } as any;
    mockScss.exportThemeAsScss = jest.fn().mockReturnValue('/* scss */');
    (component as any).openScssDialog(theme);
    expect(mockScss.exportThemeAsScss).toHaveBeenCalledWith(theme);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('manageCustomThemes opens manager dialog', () => {
    (component as any).manageCustomThemes();
    expect(mockDialog.open).toHaveBeenCalled();
  });
});
