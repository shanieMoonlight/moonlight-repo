import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailWithPwdComponent } from './confirm-email-with-pwd.component';
import { ConfirmEmailWithPwdStateService } from './confirm-email-with-pwd.state.service';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

//###############################//

const mockStateService = {
  confirmEmail: jest.fn(),
  successMsg: () => 'Success message', // or whatever value you want
  errorMsg: () => 'Error message',
  loading: () => false, // or true, depending on your test
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}


//###############################//

describe('ConfirmEmailWithPwdComponent', () => {
  let component: ConfirmEmailWithPwdComponent;
  let fixture: ComponentFixture<ConfirmEmailWithPwdComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailWithPwdComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmEmailWithPwdStateService, useValue: mockStateService },
        { provide: ActivatedRoute, useValue: mockActRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailWithPwdComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    // Don't call detectChanges here - let individual tests control when to trigger change detection
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the confirmed card when _emailConfirmedSuccessMsg() is non-empty', () => {
    jest.spyOn(component as any, '_emailConfirmedSuccessMsg').mockReturnValue('Confirmed!');
    fixture.detectChanges();
    const card = nativeEl.querySelector('sb-confirmed-card');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('show')).toBe(true);
  });

  it('should hide the confirmed card when _emailConfirmedSuccessMsg() is empty', () => {
    jest.spyOn(component as any, '_emailConfirmedSuccessMsg').mockReturnValue('');
    fixture.detectChanges();
    const card = nativeEl.querySelector('sb-confirmed-card');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('show')).toBe(false);
  });

  it('should show the error button when _errorMsg() is non-empty', () => {
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('Some error');
    fixture.detectChanges();
    const btn = nativeEl.querySelector('.resend-confirmation-btn');
    expect(btn).toBeTruthy();
    expect(btn?.classList.contains('show')).toBe(true);
  });

  it('should hide the error button when _errorMsg() is empty', () => {
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('');
    fixture.detectChanges();
    const btn = nativeEl.querySelector('.resend-confirmation-btn');
    expect(btn).toBeTruthy();
    expect(btn?.classList.contains('show')).toBe(false);
  });

  it('should show the login button when _resendSuccess() is true', () => {
    jest.spyOn(component as any, '_resendSuccess').mockReturnValue(true);
    fixture.detectChanges();
    const loginBtn = nativeEl.querySelector('.go-to-login-btn');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.classList.contains('show')).toBe(true);
  });

  it('should hide the login button when _resendSuccess() is false', () => {
    jest.spyOn(component as any, '_resendSuccess').mockReturnValue(false);
    fixture.detectChanges();
    const loginBtn = nativeEl.querySelector('.go-to-login-btn');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.classList.contains('show')).toBe(false);
  });

  it('should pass correct values to sb-notifications-modal-mat', () => {
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('err');
    jest.spyOn(component as any, '_resendSuccessMsg').mockReturnValue('success');
    jest.spyOn(component as any, '_loading').mockReturnValue(true);
    fixture.detectChanges();
    const modal = nativeEl.querySelector('sb-notifications-modal-mat');
    expect(modal).toBeTruthy();
  });

  it('should call goToLogin when login button is clicked', () => {
    jest.spyOn(component as any, '_resendSuccess').mockReturnValue(true);
    const goToLoginSpy = jest.spyOn(component, 'goToLogin');
    fixture.detectChanges();
    const loginBtn = nativeEl.querySelector('.go-to-login-btn') as HTMLElement;
    expect(loginBtn).toBeTruthy();
    loginBtn.click();
    expect(goToLoginSpy).toHaveBeenCalled();
  });

  it('should call resendConfirmation when resend button is clicked', () => {
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('Some error');
    const resendSpy = jest.spyOn(component, 'resendConfirmation');
    fixture.detectChanges();
    const resendBtn = nativeEl.querySelector('.resend-confirmation-btn') as HTMLElement;
    expect(resendBtn).toBeTruthy();
    resendBtn.click();
    expect(resendSpy).toHaveBeenCalled();
  });

  it('should hide all UI elements when all signals are falsy', () => {
    jest.spyOn(component as any, '_emailConfirmedSuccessMsg').mockReturnValue('');
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('');
    jest.spyOn(component as any, '_resendSuccess').mockReturnValue(false);
    jest.spyOn(component as any, '_resendSuccessMsg').mockReturnValue('');
    jest.spyOn(component as any, '_loading').mockReturnValue(false);
    fixture.detectChanges();
    const card = nativeEl.querySelector('sb-confirmed-card');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('show')).toBe(false);
    const errorBtn = nativeEl.querySelector('.resend-confirmation-btn');
    expect(errorBtn).toBeTruthy();
    expect(errorBtn?.classList.contains('show')).toBe(false);
    const loginBtn = nativeEl.querySelector('.go-to-login-btn');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.classList.contains('show')).toBe(false);
    const modal = nativeEl.querySelector('sb-notifications-modal-mat');
    expect(modal).toBeTruthy();
  });
});
