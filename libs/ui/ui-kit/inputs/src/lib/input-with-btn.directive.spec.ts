import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbInputWithBtnDirective } from './input-with-btn.directive';

@Component({
  template: `
    <div [sbInputWithBtn] id="default-container">
      <input type="text" placeholder="Default input" />
      <button type="button">Toggle</button>
    </div>
    <div [sbInputWithBtn] color="secondary" id="secondary-container">
      <input type="password" placeholder="Secondary input" />
      <button type="button">Show</button>
    </div>
    <div [sbInputWithBtn] color="error" id="error-container">
      <input type="email" placeholder="Error input" />
      <button type="button">Clear</button>
    </div>
  `,
  standalone: true,
  imports: [SbInputWithBtnDirective],
})
class TestComponent {}

describe('SbInputWithBtnDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let containerElements: DebugElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    containerElements = fixture.debugElement.queryAll(By.directive(SbInputWithBtnDirective));
    fixture.detectChanges();
  });



  it('should create an instance', () => {
    expect(containerElements.length).toBe(3);
    containerElements.forEach(container => {
      expect(container.injector.get(SbInputWithBtnDirective)).toBeTruthy();
    });
  });


  it('should add sb-input-with-btn-container class to container elements', () => {
    containerElements.forEach(container => {
      expect(container.nativeElement.classList.contains('sb-input-with-btn-container')).toBe(true);
    });
  });


  it('should apply default container styles', () => {
    const defaultContainer = containerElements[0].nativeElement as HTMLElement;
    
    expect(defaultContainer.style.position).toBe('relative');
    expect(defaultContainer.style.display).toBe('flex');
    expect(defaultContainer.style.alignItems).toBe('center');
    expect(defaultContainer.style.justifyContent).toBe('space-between');
  });


  it('should apply input styles to inner input elements', () => {
    containerElements.forEach(container => {
      const inputElement = container.nativeElement.querySelector('input') as HTMLInputElement;
      expect(inputElement).toBeTruthy();
      
      expect(inputElement.style.all).toBe('unset');
      expect(inputElement.style.padding).toBe('0.75rem 1rem');
      expect(inputElement.style.fontSize).toBe('1rem');
      expect(inputElement.style.borderTopLeftRadius).toBe('inherit');
      expect(inputElement.style.borderBottomLeftRadius).toBe('inherit');
      expect(inputElement.style.backgroundColor).toBe('transparent');
      expect(inputElement.style.outline).toBe('none');
      expect(inputElement.style.flex).toBe('1 1 0%');
    });
  });



  it('should change container border color on focusin with primary theme', () => {
    const defaultContainer = containerElements[0].nativeElement as HTMLElement;
    const inputElement = defaultContainer.querySelector('input') as HTMLInputElement;

    console.log('inputElement:', inputElement );
    
    
    // Manually dispatch the focusin event since inputElement.focus() doesn't trigger it in tests
    const focusinEvent = new FocusEvent('focusin', { bubbles: true });
    inputElement.dispatchEvent(focusinEvent);
    fixture.detectChanges();
    
    expect(defaultContainer.style.borderColor).toBe('var(--mat-sys-primary)');
  });
  


  it('should change container border color on focusin with secondary theme', () => {
    const secondaryContainer = containerElements[1].nativeElement as HTMLElement;
    const inputElement = secondaryContainer.querySelector('input') as HTMLInputElement;
    
    const focusinEvent = new FocusEvent('focusin', { bubbles: true });
    inputElement.dispatchEvent(focusinEvent);
    fixture.detectChanges();
    
    expect(secondaryContainer.style.borderColor).toBe('var(--mat-sys-secondary)');
  });
  


  it('should change container border color on focusin with error theme', () => {
    const errorContainer = containerElements[2].nativeElement as HTMLElement;
    const inputElement = errorContainer.querySelector('input') as HTMLInputElement;
    
    const focusinEvent = new FocusEvent('focusin', { bubbles: true });
    inputElement.dispatchEvent(focusinEvent);
    fixture.detectChanges();
    
    expect(errorContainer.style.borderColor).toBe('var(--mat-sys-error)');
  });
  


  it('should reset container border color on focusout', () => {
    const defaultContainer = containerElements[0].nativeElement as HTMLElement;
    const inputElement = defaultContainer.querySelector('input') as HTMLInputElement;
    
    // Focus first
    const focusinEvent = new FocusEvent('focusin', { bubbles: true });
    inputElement.dispatchEvent(focusinEvent);
    fixture.detectChanges();
    expect(defaultContainer.style.borderColor).toBe('var(--mat-sys-primary)');
    
    // Then blur
    const focusoutEvent = new FocusEvent('focusout', { bubbles: true });
    inputElement.dispatchEvent(focusoutEvent);
    fixture.detectChanges();
    expect(defaultContainer.style.borderColor).toBe('var(--mat-sys-outline)');
  });


  
  it('should handle multiple focusin and focusout events properly', () => {
    const defaultContainer = containerElements[0].nativeElement as HTMLElement;
    const inputElement = defaultContainer.querySelector('input') as HTMLInputElement;
    
    // Test multiple focus/blur cycles
    for (let i = 0; i < 3; i++) {
      const focusinEvent = new FocusEvent('focusin', { bubbles: true });
      inputElement.dispatchEvent(focusinEvent);
      fixture.detectChanges();
      expect(defaultContainer.style.borderColor).toBe('var(--mat-sys-primary)');
      
      const focusoutEvent = new FocusEvent('focusout', { bubbles: true });
      inputElement.dispatchEvent(focusoutEvent);
      fixture.detectChanges();
      expect(defaultContainer.style.borderColor).toBe('var(--mat-sys-outline)');
    }
  });
  



  it('should work with different input types', () => {
    const containers = containerElements.map(c => c.nativeElement as HTMLElement);
    const inputs = containers.map(c => c.querySelector('input') as HTMLInputElement);
    
    expect(inputs[0].type).toBe('text');
    expect(inputs[1].type).toBe('password');
    expect(inputs[2].type).toBe('email');
    
    // All should have the same input styling applied
    inputs.forEach(input => {
      expect(input.style.padding).toBe('0.75rem 1rem');
      expect(input.style.flex).toBe('1 1 0%');
    });
  });



  it('should handle containers with buttons alongside inputs', () => {
    containerElements.forEach(container => {
      const containerElement = container.nativeElement as HTMLElement;
      const inputElement = containerElement.querySelector('input');
      const buttonElement = containerElement.querySelector('button');
      
      expect(inputElement).toBeTruthy();
      expect(buttonElement).toBeTruthy();
      
      // Container should still have flex layout
      expect(containerElement.style.display).toBe('flex');
      expect(containerElement.style.alignItems).toBe('center');
    });
  });
});