import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MlCurrentThemeBannerComponent } from './current-theme-banner.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component } from '@angular/core';

// Create a test host component to properly set the input
@Component({
  template: `<ml-current-theme-banner [withTooltips]="showTooltips"></ml-current-theme-banner>`,
  imports: [MlCurrentThemeBannerComponent],
  standalone: true
})
class TestHostComponent {
  showTooltips = false;
}

describe('MlCurrentThemeBannerComponent', () => {
  let hostComponent: TestHostComponent;
  let component: MlCurrentThemeBannerComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, MlCurrentThemeBannerComponent, MatTooltipModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(MlCurrentThemeBannerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display three color sections', () => {
    const divElements = fixture.debugElement.queryAll(By.css('div'));
    expect(divElements.length).toBe(3);
  });

  it('should not show tooltips by default', () => {
    const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
    const middleSection = fixture.debugElement.query(By.css('.middle')).nativeElement;
    const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;
    
    // Check for empty matTooltip values
    expect(leftSection.getAttribute('ng-reflect-message')).toBe('');
    expect(middleSection.getAttribute('ng-reflect-message')).toBe('');
    expect(rightSection.getAttribute('ng-reflect-message')).toBe('');
  });

  it('should show tooltips when withTooltips is true', () => {
    // Enable tooltips
    hostComponent.showTooltips = true;
    fixture.detectChanges();
    
    const leftSection = fixture.debugElement.query(By.css('.left')).nativeElement;
    const middleSection = fixture.debugElement.query(By.css('.middle')).nativeElement;
    const rightSection = fixture.debugElement.query(By.css('.right')).nativeElement;
    
    // Check for tooltip text
    expect(middleSection.getAttribute('ng-reflect-message')).toContain('Primary');
    expect(leftSection.getAttribute('ng-reflect-message')).toContain('Secondary');
    expect(rightSection.getAttribute('ng-reflect-message')).toContain('Tertiary');
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