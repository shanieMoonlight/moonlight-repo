import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbButtonIconAddComponent } from './button-add.component';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

// Mock for SbIconButtonComponent if needed
// (Assume it is standalone and can be imported directly)

describe('SbButtonIconAddComponent', () => {
  let fixture: ComponentFixture<SbButtonIconAddComponent>;
  let component: SbButtonIconAddComponent;
  let componentRef: ComponentRef<SbButtonIconAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbButtonIconAddComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SbButtonIconAddComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the circle SVG when circle is true', () => {
    componentRef.setInput('circle', true);
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg.nativeElement.innerHTML).toContain('M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Z');
  });

  it('should render the square SVG when circle is false', () => {
    componentRef.setInput('circle', false);
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg.nativeElement.innerHTML).toContain('M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z');
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
