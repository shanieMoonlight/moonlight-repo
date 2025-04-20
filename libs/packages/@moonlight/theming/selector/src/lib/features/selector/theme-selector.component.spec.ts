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
import { DEFAULT_COLOR_PRIMARY, DEFAULT_COLOR_SECONDARY, ThemeConfig, ThemeConfigService, ThemeOption } from '../../../../../config/src/index';
import { ThemeGeneratorService } from '../../../../../service/src/index';
import { ScssDisplayComponent } from '../../ui/scss-display.component';
import { ThemeSelectorComponent } from './theme-selector.component';
// import { ThemeGeneratorService } from '@moonlight/ng/theming/service';
// import { ThemeConfig, ThemeConfigService, ThemeOption } from '@moonlight/ng/theming/config';
// NOTE: No need to import MatDialogModule or MatEverythingModule here

// --- Mock Data & Shared Variables (Keep as before) ---
const mockPresets: ThemeOption[] = [
  { value: 'preset1', label: 'Preset 1', primaryColor: '#111111', secondaryColor: '#aaaaaa', darkMode: false },
  { value: 'preset2', label: 'Preset 2', primaryColor: '#222222', secondaryColor: '#bbbbbb', darkMode: true },
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
    Object.defineProperty(global.document, 'documentElement', {
        value: document.createElement('html'),
        writable: true,
    });
  });

  // --- Group 1: Direct Component Logic Tests ---
  describe('Direct Logic', () => {
    // Keep component/fixture variables
    let component: ThemeSelectorComponent;
    let fixture: ComponentFixture<ThemeSelectorComponent>;
    // Keep the mock instance variable
    let directDialogMock: { open: jest.Mock }; 

    // Use MockBuilder for TestBed configuration
    beforeEach(() => {
      // Reset the mock before each test run with MockBuilder
      directDialogMock = { open: jest.fn() }; 

      // Configure TestBed using MockBuilder
      return MockBuilder(ThemeSelectorComponent) // Start with the component under test
        // Provide mocks for its direct dependencies that you want mocked
        .mock(ThemeGeneratorService, themeGeneratorMock) // Use the mock from outer scope
        .mock(ThemeConfigService, mockThemeConfig)     // Use the mock from outer scope
        .mock(MatDialog, directDialogMock)             // Explicitly mock MatDialog with our instance
        
        // Keep modules required by the component's TEMPLATE or internal logic
        .keep(ReactiveFormsModule) 
        .keep(NoopAnimationsModule); 
        // DO NOT .keep() MatEverythingModule or MatDialogModule
        // MockBuilder will automatically handle basic standalone component setup
    });

    // Use MockRender to create the component instance
    beforeEach(() => {
      fixture = MockRender(ThemeSelectorComponent);
      component = fixture.componentInstance;
      // fixture.detectChanges(); // Often not needed immediately with MockRender, call within tests if required
    });

    it('should create', () => {
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