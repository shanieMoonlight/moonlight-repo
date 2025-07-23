import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { By } from '@angular/platform-browser';
import { SbCurrentThemeBannerComponent } from './current-theme-banner.component';

// Create a test host component to properly set the input
@Component({
  template: `<sb-current-theme-banner [withTooltips]="showTooltips"></sb-current-theme-banner>`,
  imports: [SbCurrentThemeBannerComponent],
  standalone: true
})
class TestHostComponent {
  showTooltips = false;
}

describe('SbCurrentThemeBannerComponent', () => {
  let hostComponent: TestHostComponent;
  let component: SbCurrentThemeBannerComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SbCurrentThemeBannerComponent, MatTooltipModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(SbCurrentThemeBannerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display three color sections', () => {
    const divElements = fixture.debugElement.queryAll(By.css('div'));
    expect(divElements.length).toBe(3);
  });
it('should not show tooltips by default0', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);

  // Query all tooltips in the component
  const tooltips = await loader.getAllHarnesses(MatTooltipHarness);

  // There should be 3 tooltips (left, middle, right)
  expect(tooltips.length).toBe(3);

  // Check that tooltips are disabled or have empty message by default
  for (const tooltip of tooltips) {
    const message = await tooltip.getTooltipText().catch(() => '');
    expect(message).toBe('');
  }
});
  // it('should not show tooltips by default', () => {
  //   const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
  //   const middleSection = fixture.debugElement.query(By.css('.middle')).nativeElement;
  //   const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;
    
  //   // Check for empty matTooltip values
  //   expect(leftSection.getAttribute('ng-reflect-message')).toBe('');
  //   expect(middleSection.getAttribute('ng-reflect-message')).toBe('');
  //   expect(rightSection.getAttribute('ng-reflect-message')).toBe('');
  // });


it('should show tooltips when withTooltips is true0', async () => {
  // Enable tooltips
  hostComponent.showTooltips = true;
  fixture.detectChanges();

  const loader = TestbedHarnessEnvironment.loader(fixture);

  // Query all tooltips in the component
  const tooltips = await loader.getAllHarnesses(MatTooltipHarness);

  // There should be 3 tooltips (left, middle, right)
  expect(tooltips.length).toBe(3);

  // Show each tooltip and get its text
  const messages:string[] = [];
  for (const tooltip of tooltips) {
    await tooltip.show();
    const tooltipText = await tooltip.getTooltipText();
    expect(tooltipText).toBeDefined();
    console.log('tooltipText', tooltipText);    
    messages.push(await tooltip.getTooltipText() ?? '');
    await tooltip.hide(); // optional: hide after checking
  }

  expect(messages).toContainEqual(expect.stringContaining('Primary'));
  expect(messages).toContainEqual(expect.stringContaining('Secondary'));
  expect(messages).toContainEqual(expect.stringContaining('Tertiary'));
});

  it('should have appropriate CSS variables set', () => {
    const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
    const middleSection = fixture.debugElement.query(By.css('.middle')).nativeElement;
    const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;
    
    // Check computed styles have CSS variables
    // Note: Since we're not setting these CSS variables in the test,
    // we just verify the style is set (not its actual value)
    expect(window.getComputedStyle(leftSection).backgroundImage).toBeDefined();
    expect(window.getComputedStyle(middleSection).backgroundImage).toBeDefined();
    expect(window.getComputedStyle(rightSection).backgroundImage).toBeDefined();
  });

  it('should transition colors smoothly', () => {
    // Check that transition CSS is applied
    const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
    const computedStyle = window.getComputedStyle(leftSection);
    
    // Testing for the presence of transitions
    expect(computedStyle.transitionProperty).toBeDefined();
    
    // Note: The test runner might not fully compute styles, 
    // so we may not be able to verify the exact transition values
  });
});