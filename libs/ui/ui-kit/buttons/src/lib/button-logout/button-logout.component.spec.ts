import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbButtonIconLogoutComponent } from './button-logout.component';
import { SbIconButtonComponent } from '../icon-button/icon-button.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('SbButtonIconLogoutComponent', () => {
  let fixture: ComponentFixture<SbButtonIconLogoutComponent>;
  let component: SbButtonIconLogoutComponent;
  let componentRef: ComponentRef<SbButtonIconLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbButtonIconLogoutComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SbButtonIconLogoutComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logout SVG', () => {
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg.nativeElement.innerHTML).toContain('M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z');
  });

  it('should pass the disabled input to SbIconButtonComponent', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const textButton = fixture.debugElement.query(By.directive(SbIconButtonComponent));
    expect(textButton.componentInstance.disabled()).toBe(true);
  });

  it('should pass the color input to SbIconButtonComponent', () => {
    componentRef.setInput('color', 'secondary');
    fixture.detectChanges();
    const iconButton = fixture.debugElement.query(By.directive(SbIconButtonComponent));
    expect(iconButton.componentInstance.color()).toBe('secondary');
  });
});
