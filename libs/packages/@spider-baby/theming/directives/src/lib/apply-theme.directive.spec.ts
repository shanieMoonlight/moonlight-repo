import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { ThemeService } from '@spider-baby/material-theming/service';
import { MlApplyThemeDirective } from './apply-theme.directive';

// Mock ThemeService
const mockThemeService = {
  applyTheme: jest.fn(),
  applyThemeByValue: jest.fn()
};

// Test component with string value
@Component({
  selector: 'sb-test-string-component', // Add unique selector
  standalone: true, // Make it standalone
  imports: [MlApplyThemeDirective], // Import the directive
  template: `<div [sbApplyTheme]="themeValue"></div>`
})
class TestStringComponent {
  themeValue = 'material-light';
}

// Test component with number value
@Component({
  selector: 'sb-test-number-component', // Add unique selector
  standalone: true, // Make it standalone
  imports: [MlApplyThemeDirective], // Import the directive
  template: `<div [sbApplyTheme]="themeNumber"></div>`
})
class TestNumberComponent {
  themeNumber = 42;
}

// Test component with ThemeOption object
@Component({
  selector: 'sb-test-object-component', // Add unique selector
  standalone: true, // Make it standalone
  imports: [MlApplyThemeDirective], // Import the directive
  template: `<div [sbApplyTheme]="themeObject"></div>`
})
class TestObjectComponent {
  themeObject: ThemeOption = ThemeOption.create({
    value: 'test-value',
    label: 'Test Theme',
    primaryColor: '#673AB7',
    secondaryColor: '#00BCD4',
    darkMode: 'light'
  });
}

// Test component with attribute syntax
@Component({
  selector: 'sb-test-attribute-component', // Add unique selector
  standalone: true, // Make it standalone
  imports: [MlApplyThemeDirective], // Import the directive
  template: `<div sbApplyTheme="attribute-theme"></div>`
})
class TestAttributeComponent {}

// Test component with undefined value
@Component({
  selector: 'sb-test-undefined-component', // Add unique selector
  standalone: true, // Make it standalone
  imports: [MlApplyThemeDirective], // Import the directive
  template: `<div [sbApplyTheme]="undefinedTheme"></div>`
})
class TestUndefinedComponent {
  undefinedTheme = undefined;
}

describe('MlApplyThemeDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Remove the declarations array since we're using standalone components
      imports: [
        // Import the standalone components instead of declaring them
        TestStringComponent,
        TestNumberComponent,
        TestObjectComponent,
        TestAttributeComponent,
        TestUndefinedComponent
      ],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    });
    
    // Reset mock function calls before each test
    jest.clearAllMocks();
  });

  it('should apply theme by value when string is provided', () => {
    const fixture = TestBed.createComponent(TestStringComponent);
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    
    expect(mockThemeService.applyThemeByValue).toHaveBeenCalledWith(
      'material-light',
      element
    );
    expect(mockThemeService.applyTheme).not.toHaveBeenCalled();
  });

  it('should apply theme by value when number is provided', () => {
    const fixture = TestBed.createComponent(TestNumberComponent);
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    
    expect(mockThemeService.applyThemeByValue).toHaveBeenCalledWith(
      42,
      element
    );
    expect(mockThemeService.applyTheme).not.toHaveBeenCalled();
  });

  it('should apply theme when ThemeOption object is provided', () => {
    const fixture = TestBed.createComponent(TestObjectComponent);
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    const themeObject = fixture.componentInstance.themeObject;
    
    expect(mockThemeService.applyTheme).toHaveBeenCalledWith(
      themeObject,
      element
    );
    expect(mockThemeService.applyThemeByValue).not.toHaveBeenCalled();
  });

  it('should apply theme by value when using attribute syntax', () => {
    const fixture = TestBed.createComponent(TestAttributeComponent);
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    
    expect(mockThemeService.applyThemeByValue).toHaveBeenCalledWith(
      'attribute-theme',
      element
    );
    expect(mockThemeService.applyTheme).not.toHaveBeenCalled();
  });

  it('should not call any theme methods when value is undefined', () => {
    const fixture = TestBed.createComponent(TestUndefinedComponent);
    fixture.detectChanges();
    
    expect(mockThemeService.applyTheme).not.toHaveBeenCalled();
    expect(mockThemeService.applyThemeByValue).not.toHaveBeenCalled();
  });

  it('should respond to input changes', () => {
    const fixture = TestBed.createComponent(TestStringComponent);
    fixture.detectChanges();
    
    // First call with initial value
    expect(mockThemeService.applyThemeByValue).toHaveBeenCalledTimes(1);
    
    // Change the input value
    fixture.componentInstance.themeValue = 'material-dark';
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css('div')).nativeElement;
    
    // Should have been called again with new value
    expect(mockThemeService.applyThemeByValue).toHaveBeenCalledTimes(2);
    expect(mockThemeService.applyThemeByValue).toHaveBeenLastCalledWith(
      'material-dark',
      element
    );
  });
});