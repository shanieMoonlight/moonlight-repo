import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbVerify2FactorFormComponent } from './verify-2factor.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FirstErrorComponent,
  FirstErrorDirective,
} from '@spider-baby/utils-forms';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbInputStyleDirective } from '@spider-baby/ui-kit/inputs';

describe('SbVerify2FactorFormComponent', () => {
  let component: SbVerify2FactorFormComponent;
  let fixture: ComponentFixture<SbVerify2FactorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbVerify2FactorFormComponent,
        ReactiveFormsModule,
        FirstErrorComponent,
        FirstErrorDirective,
        SbButtonComponent,
        SbInputStyleDirective,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SbVerify2FactorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a required token control', () => {
    const tokenControl = component['form'].controls.token;
    tokenControl.setValue('');
    expect(tokenControl.valid).toBeFalsy();
    tokenControl.setValue('123456');
    expect(tokenControl.valid).toBeTruthy();
  });

  it('should emit verify2Factor event with token on valid submit', () => {
    jest.spyOn(component.verify2Factor, 'emit');
    component['form'].controls.token.setValue('654321');
    component.submit();
    expect(component.verify2Factor.emit).toHaveBeenCalledWith({
      token: '654321',
    });
  });

  it('should not emit verify2Factor event if form is invalid', () => {
    jest.spyOn(component.verify2Factor, 'emit');
    component['form'].controls.token.setValue('');
    component.submit();
    expect(component.verify2Factor.emit).not.toHaveBeenCalled();
  });

  it('should disable submit if form is invalid', () => {
    component['form'].controls.token.setValue('');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should enable submit if form is valid', () => {
    component['form'].controls.token.setValue('123456');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });
});
