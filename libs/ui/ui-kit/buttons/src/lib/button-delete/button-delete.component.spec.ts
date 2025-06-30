import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbButtonIconDeleteComponent } from './button-delete.component';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('SbButtonIconDeleteComponent', () => {
  let fixture: ComponentFixture<SbButtonIconDeleteComponent>;
  let component: SbButtonIconDeleteComponent;
  let componentRef: ComponentRef<SbButtonIconDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbButtonIconDeleteComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SbButtonIconDeleteComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the delete SVG', () => {
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg.nativeElement.innerHTML).toContain('M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Z');
  });

  it('should pass the disabled input to SbIconButtonComponent', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(SbIconButtonComponent));
    expect(iconButton.componentInstance.disabled()).toBe(true);
  });

  it('should pass the color input to SbIconButtonComponent', () => {
    componentRef.setInput('color', 'error');
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(SbIconButtonComponent));
    expect(iconButton.componentInstance.color()).toBe('error');
  });
});
