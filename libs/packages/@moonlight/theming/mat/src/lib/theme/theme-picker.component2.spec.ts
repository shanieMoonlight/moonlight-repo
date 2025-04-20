import { fireEvent } from '@testing-library/angular';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MlThemePicker_Mat_Component } from './theme-picker.component';
// tooltip-test.component.spec.ts
import { render, screen } from '@testing-library/angular';
import { ComponentFixture } from '@angular/core/testing';

describe('MlThemePicker_Mat_Component', () => {
    let component: MlThemePicker_Mat_Component;
    let fixture: ComponentFixture<MlThemePicker_Mat_Component>;
    let loader: HarnessLoader;
  
    beforeEach(async () => {
      // Create the component fixture
      ({ fixture } = await render(MlThemePicker_Mat_Component, {
        imports: [MatTooltipModule]
      }));
  
      // Initialize the harness loader with the fixture
      loader = TestbedHarnessEnvironment.loader(fixture);
    });
  
    it('should show tooltip on hover', async () => {
      const button = screen.getByTestId('btn-icon');
      console.log('button', button);
      
      const tooltipHarness = await loader.getHarness(MatTooltipHarness);
  
      // Trigger hover
      fireEvent.mouseEnter(button);
  
      // Wait for tooltip to appear
      await tooltipHarness.show();
      console.log('tooltipHarness', await tooltipHarness.getTooltipText());
      
      expect(await tooltipHarness.getTooltipText()).toBe('Change app theme');
    });
  });