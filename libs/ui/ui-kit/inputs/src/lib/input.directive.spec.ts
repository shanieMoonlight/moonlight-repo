import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbInputStyleDirective } from './input.directive';

@Component({
  template: `
    <input [sbInputStyle] id="default-input" />
    <input [sbInputStyle] color="secondary" id="secondary-input" />
    <input [sbInputStyle] color="error" id="error-input" />
  `,
  standalone: true,
  imports: [SbInputStyleDirective],
})
class TestComponent {}

describe('InputStyleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElements: DebugElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    inputElements = fixture.debugElement.queryAll(By.directive(SbInputStyleDirective));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(inputElements.length).toBe(3);
    inputElements.forEach(input => {
      expect(input.injector.get(SbInputStyleDirective)).toBeTruthy();
    });
  });

  it('should add sb-input class to input elements', () => {
    inputElements.forEach(input => {
      expect(input.nativeElement.classList.contains('sb-input')).toBe(true);
    });
  });


  it('should change border color on focus with primary theme', () => {
    const defaultInput = inputElements[0].nativeElement as HTMLInputElement;
    
    defaultInput.focus();
    fixture.detectChanges();
    
    expect(defaultInput.style.border).toBe('1px solid var(--mat-sys-primary)');
    expect(defaultInput.style.outline).toBe('none');
  });

  it('should change border color on focus with secondary theme', () => {
    const secondaryInput = inputElements[1].nativeElement as HTMLInputElement;
    
    secondaryInput.focus();
    fixture.detectChanges();
    
    expect(secondaryInput.style.border).toBe('1px solid var(--mat-sys-secondary)');
    expect(secondaryInput.style.outline).toBe('none');
  });

  it('should change border color on focus with error theme', () => {
    const errorInput = inputElements[2].nativeElement as HTMLInputElement;
    
    errorInput.focus();
    fixture.detectChanges();
    
    expect(errorInput.style.border).toBe('1px solid var(--mat-sys-error)');
    expect(errorInput.style.outline).toBe('none');
  });

  it('should reset border color on blur', () => {
    const defaultInput = inputElements[0].nativeElement as HTMLInputElement;
    
    // Focus first
    defaultInput.focus();
    fixture.detectChanges();
    expect(defaultInput.style.border).toBe('1px solid var(--mat-sys-primary)');
    
    // Then blur
    defaultInput.blur();
    fixture.detectChanges();
    expect(defaultInput.style.border).toBe('1px solid var(--mat-sys-outline)');
  });

  it('should handle focus and blur events properly', () => {
    const defaultInput = inputElements[0].nativeElement as HTMLInputElement;
    
    // Test multiple focus/blur cycles
    for (let i = 0; i < 3; i++) {
      defaultInput.focus();
      fixture.detectChanges();
      expect(defaultInput.style.border).toBe('1px solid var(--mat-sys-primary)');
      
      defaultInput.blur();
      fixture.detectChanges();
      expect(defaultInput.style.border).toBe('1px solid var(--mat-sys-outline)');
    }
  });
});
