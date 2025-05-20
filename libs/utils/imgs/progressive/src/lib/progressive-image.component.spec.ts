import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Directive, input, output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ProgressiveImageComponent } from './progressive-image.component';

// Mock the ProgressiveImageLoaderDirective to isolate component tests
@Directive({
  selector: '[sbProgImgLoader]',
  standalone: true,
})
class MockProgressiveImageLoaderDirective {
  fallbackUrl = input<string>();
  smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>();
  lrgUrl = input<string | null | undefined>();
  retryTimeoutMs = input<number>();
  retryCount = input<number>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  error = output<void>(); // Changed from errorOccurred to error

  // Method to trigger error emission for testing
  triggerError() {
    this.error.emit(); // Changed from errorOccurred to error
  }
}

describe('ProgressiveImageComponent', () => {
  let component: ProgressiveImageComponent;
  let fixture: ComponentFixture<ProgressiveImageComponent>;
  let imgDebugElement: DebugElement;
  let directiveEl: DebugElement;

  const testPlaceholder = 'placeholder.jpg';
  const testFallback = 'fallback.svg';
  const testLargeUrl = 'large.jpg';
  const testSmlToLrgFn = (sml: string) => sml.replace('small', 'large');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import the component
      imports: [ProgressiveImageComponent],
    })
    .overrideComponent(ProgressiveImageComponent, {
      // Remove the original ProgressiveImageLoaderDirective and use our mock
      set: {
        imports: [MockProgressiveImageLoaderDirective]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressiveImageComponent);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('placeholder', testPlaceholder);
    fixture.detectChanges(); // Trigger initial data binding

    imgDebugElement = fixture.debugElement.query(By.css('img'));
    directiveEl = fixture.debugElement.query(By.directive(MockProgressiveImageLoaderDirective));
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the sbProgImgLoader directive to the img element', () => {
    expect(directiveEl).not.toBeNull();
  });

  it('should pass placeholder to img src', () => {
    expect(imgDebugElement.nativeElement.getAttribute('src')).toContain(testPlaceholder);
  });

  it('should pass inputs to ProgressiveImageLoaderDirective', () => {
    fixture.componentRef.setInput('fallbackUrl', testFallback);
    fixture.componentRef.setInput('smlToLrgFn', testSmlToLrgFn);
    fixture.componentRef.setInput('lrgUrl', testLargeUrl);
    fixture.componentRef.setInput('retryTimeoutMs', 5000);
    fixture.componentRef.setInput('retryCount', 5);
    fixture.detectChanges();

    const directiveInstance = directiveEl.injector.get(MockProgressiveImageLoaderDirective);
    expect(directiveInstance.fallbackUrl()).toBe(testFallback);
    expect(directiveInstance.smlToLrgFn()).toBe(testSmlToLrgFn);
    expect(directiveInstance.lrgUrl()).toBe(testLargeUrl);
    expect(directiveInstance.retryTimeoutMs()).toBe(5000);
    expect(directiveInstance.retryCount()).toBe(5);
  });

  it('should emit error output from ProgressiveImageLoaderDirective', () => {
  // Replace jasmine.createSpy with Jest's jest.fn()
  const errorSpy = jest.fn();
  component.imgError.subscribe(errorSpy);

    // Trigger the directive's error output
    const directiveInstance = directiveEl.injector.get(MockProgressiveImageLoaderDirective);
    directiveInstance.triggerError();
    
    expect(errorSpy).toHaveBeenCalled();
  });

  // Test for default values of optional inputs
  it('should use default values for optional inputs if not provided', () => {
    // Reset fixture to a new component instance without setting optional inputs
    fixture = TestBed.createComponent(ProgressiveImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('placeholder', 'another.jpg');
    fixture.detectChanges();
    
    // Find directive instance again for the new component instance
    const directiveEl = fixture.debugElement.query(By.directive(MockProgressiveImageLoaderDirective));
    const directiveInstance = directiveEl.injector.get(MockProgressiveImageLoaderDirective);

    // Check against default values defined in ProgressiveImageComponent
    expect(directiveInstance.fallbackUrl()).toBeUndefined(); // Will be the default from the component
    expect(directiveInstance.smlToLrgFn()).toBeUndefined();
    expect(directiveInstance.lrgUrl()).toBe(''); // Default from component
    expect(directiveInstance.retryTimeoutMs()).toBe(3000); // Default from component
    expect(directiveInstance.retryCount()).toBe(3); // Default from component
  });
});
