import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbDarkModeRadioGroup } from './dark-mode-control.cva';
import { ComponentRef } from '@angular/core';

describe('SbDarkModeRadioGroup', () => {
  let fixture: ComponentFixture<SbDarkModeRadioGroup>;
  let loader: HarnessLoader;
    let componentRef:ComponentRef<SbDarkModeRadioGroup>;
    let componentInstance:SbDarkModeRadioGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbDarkModeRadioGroup, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SbDarkModeRadioGroup);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    componentRef = fixture.componentRef;
    componentInstance = fixture.componentInstance;
  });

  it('has default value system and reflects in the radio group', async () => {
    const radioGroup = await loader.getHarness(MatRadioGroupHarness);
    const checked = await radioGroup.getCheckedValue();
    expect(checked).toBe('system');
    expect(fixture.componentInstance.value).toBe('system');
  });

  it('selects Light radio button and updates component value', async () => {
    const radioGroup = await loader.getHarness(MatRadioGroupHarness);

    // check by label
    await radioGroup.checkRadioButton({ label: 'Light' });

    const checked = await radioGroup.getCheckedValue();
    expect(checked).toBe('light');
    expect(fixture.componentInstance.value).toBe('light');
  });

  it('exposes three radio buttons with expected labels', async () => {
    const radioGroup = await loader.getHarness(MatRadioGroupHarness);
    const radios = await radioGroup.getRadioButtons();
    expect(radios.length).toBe(3);
    const labels = await Promise.all(radios.map(r => r.getLabelText()));
    expect(labels).toEqual(['Light', 'Dark', 'System']);
  });


  it('onSelectionChange sets value', async () => {
    componentInstance['onSelectionChange']('dark');
    expect(componentInstance.value).toEqual('dark');

    
    componentInstance['onSelectionChange']('light');
    expect(componentInstance.value).toEqual('light');

    
    componentInstance['onSelectionChange']('system');
    expect(componentInstance.value).toEqual('system');
  });


it('calls _onChange and _onTouched (jest.fn)', () => {
  const onChangeSpy = jest.fn();
  const onTouchedSpy = jest.fn();

  (componentInstance as any)._onChange = onChangeSpy;
  (componentInstance as any)._onTouched = onTouchedSpy;

  componentInstance['onSelectionChange']('dark');

  expect(onChangeSpy).toHaveBeenCalledWith('dark');
  expect(onTouchedSpy).toHaveBeenCalled();
});
});
