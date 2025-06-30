import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbButtonIconCloseComponent } from './button-close.component';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('SbButtonIconCloseComponent', () => {
  let fixture: ComponentFixture<SbButtonIconCloseComponent>;
  let component: SbButtonIconCloseComponent;
  let componentRef: ComponentRef<SbButtonIconCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbButtonIconCloseComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SbButtonIconCloseComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the close SVG', () => {
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg.nativeElement.innerHTML).toContain('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
  });

  it('should pass the disabled input to SbIconButtonComponent', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(SbIconButtonComponent));
    expect(iconButton.componentInstance.disabled()).toBe(true);
  });

  it('should pass the color input to SbIconButtonComponent', () => {
    componentRef.setInput('color', 'secondary');
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(SbIconButtonComponent));
    expect(iconButton.componentInstance.color()).toBe('secondary');
  });
});
