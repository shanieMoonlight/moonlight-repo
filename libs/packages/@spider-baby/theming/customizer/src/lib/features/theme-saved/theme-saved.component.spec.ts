import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing'; // Import TestBed
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { render, screen, fireEvent } from '@testing-library/angular';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { MlCustomThemeSavedComponent, CustomThemeSavedDialogData } from './theme-saved.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import '@testing-library/jest-dom';
import { MlThemeAvatarComponent } from  '@spider-baby/material-theming/ui';; // Import Real Component

// --- Mock Child Component ---
@Component({
  selector: 'sb-theme-avatar',
  template: '<div data-testid="mock-theme-avatar"></div>',
  standalone: true,
  inputs: ['theme'],
})
class MockMlThemeAvatarComponent {}

// --- Helper to create mock theme ---
const createMockTheme = (label = 'Test Theme', value = 'test-theme'): ThemeOption => ({
  label,
  value,
  primaryColor: '#673AB7',
  secondaryColor: '#FFC107',
  tertiaryColor: '#03A9F4',
  errorColor: '#F44336',
  darkMode: 'light',
});

describe('CustomThemeSavedComponent', () => {
  const mockTheme = createMockTheme('Dialog Theme', 'dialog-val');

  // --- Common Setup Function with Override ---
  async function setup(config: import('@testing-library/angular').RenderComponentOptions<MlCustomThemeSavedComponent>) {
    // Override the standalone component import
    TestBed.overrideComponent(MlCustomThemeSavedComponent, {
      remove: { imports: [MlThemeAvatarComponent] }, // Remove the real one
      add: { imports: [MockMlThemeAvatarComponent] }  // Add the mock one
    });

    return await render<MlCustomThemeSavedComponent>(MlCustomThemeSavedComponent, {
      ...config, // Apply specific scenario config (providers, inputs)
      imports: [
        ...(config.imports || []), // Keep any specific imports
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MockMlThemeAvatarComponent // Ensure mock is imported for the test setup itself
      ],
      // declarations is not needed when overriding imports
    });
  }

  // --- Test Scenario 1: Used within a MatDialog ---
  describe('Dialog Scenario', () => {
    const mockDialogRef = { close: jest.fn() };
    const mockDialogData: CustomThemeSavedDialogData = { theme: mockTheme };

    async function setupDialogScenario() {
      // Use the common setup function
      return await setup({
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        ],
      });
    }

    beforeEach(() => {
      mockDialogRef.close.mockClear();
    });

    it('should render theme details from dialog data', async () => {
      await setupDialogScenario();
      expect(screen.getByText('Theme Saved')).toBeInTheDocument();
      expect(screen.getByText(mockTheme.label!)).toBeInTheDocument();
      // Should now find the mock's template
      expect(screen.getAllByTestId('mock-theme-avatar').length).toBe(2);
    });

    it('should populate _themeSignal primarily from dialog data', async () => {
      const { fixture } = await setupDialogScenario();
      expect(fixture.componentInstance['_themeSignal']()).toEqual(mockTheme);
    });

    it('should show the OK button and identify as dialog', async () => {
      const { fixture } = await setupDialogScenario();
      expect(fixture.componentInstance['_isDialog']()).toBe(true);
      expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
    });

    it('should call dialogRef.close when OK button is clicked', async () => {
      await setupDialogScenario();
      const okButton = screen.getByRole('button', { name: /OK/i });
      fireEvent.click(okButton);
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  // --- Test Scenario 2: Used via Template Binding ---
  describe('Template Binding Scenario', () => {
    const templateTheme = createMockTheme('Template Theme', 'template-val');

    async function setupTemplateScenario() {
      // Use the common setup function
      return await setup({
        componentInputs: {
          theme: templateTheme,
        },
        providers: [], // No dialog providers
      });
    }

    it('should render theme details from input binding', async () => {
      await setupTemplateScenario();
      expect(screen.getByText('Theme Saved')).toBeInTheDocument();
      expect(screen.getByText(templateTheme.label!)).toBeInTheDocument();
      // Should now find the mock's template
      expect(screen.getAllByTestId('mock-theme-avatar').length).toBe(2);
    });

    it('should populate _themeSignal from input binding (fallback)', async () => {
      const { fixture } = await setupTemplateScenario();
      expect(fixture.componentInstance['_themeSignal']()).toEqual(templateTheme);
    });

    it('should hide the OK button and not identify as dialog', async () => {
      const { fixture } = await setupTemplateScenario();
      expect(fixture.componentInstance['_isDialog']()).toBe(false);
      expect(screen.queryByRole('button', { name: /OK/i })).not.toBeInTheDocument();
    });
  });
});