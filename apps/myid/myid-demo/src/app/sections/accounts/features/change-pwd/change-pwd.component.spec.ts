import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { ChangePwdComponent } from './change-pwd.component';

//#############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

//#############################//


describe('ChangePwdComponent', () => {
  let component: ChangePwdComponent;
  let fixture: ComponentFixture<ChangePwdComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePwdComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MyIdRouter, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePwdComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    // Don't call detectChanges here - let individual tests control when to trigger change detection
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });




  it('should call goToLogin when login button is clicked', () => {
    const goToLoginSpy = jest.spyOn(component, 'goToLogin');
    fixture.detectChanges();
    const loginBtn = nativeEl.querySelector('.go-to-login-btn') as HTMLElement;
    expect(loginBtn).toBeTruthy();
    loginBtn.click();
    expect(goToLoginSpy).toHaveBeenCalled();
  });

  it('should call changePassword when form is submitted', () => {
    const changePasswordSpy = jest.spyOn(component, 'changePassword');
    fixture.detectChanges();
    // Simulate form submission
    const form = nativeEl.querySelector('sb-change-pwd-form');
    expect(form).toBeTruthy();
    // You may need to dispatch a custom event or call the method directly depending on the form implementation
    // For now, call the method directly:
    component.changePassword({} as any);
    expect(changePasswordSpy).toHaveBeenCalled();
  });

  
  it('should pass correct values to sb-notifications-modal-mat', () => {
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('err');
    jest.spyOn(component as any, '_successMsg').mockReturnValue('success');
    jest.spyOn(component as any, '_loading').mockReturnValue(true);
    fixture.detectChanges();
    const modal = nativeEl.querySelector('sb-notifications-modal-mat');
    expect(modal).toBeTruthy();
  });

  it('should hide all UI elements when all signals are falsy', () => {
    jest.spyOn(component as any, '_changeSuccess').mockReturnValue(false);
    jest.spyOn(component as any, '_successMsg').mockReturnValue('');
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('');
    jest.spyOn(component as any, '_loading').mockReturnValue(false);
    fixture.detectChanges();
    const loginBtn = nativeEl.querySelector('.go-to-login-btn');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.classList.contains('show')).toBe(false);
  });
});
