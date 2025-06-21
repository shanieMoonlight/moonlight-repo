import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { ConfirmPhoneComponent } from './confirm-phone.component';
import { signal } from '@angular/core';

//#############################//

const emailConfirmedSignal = signal('');
const errorMsgSignal = signal('');
const loadingSignal = signal(false);
const resendSuccessMsgSignal = signal('');
const resendSuccessSignal = signal(false);

const mockStateService = {
  resend: jest.fn(),
  successMsg: () => 'Success message',
  errorMsg: errorMsgSignal,
  loading: loadingSignal,
  phoneConfirmedSuccessMsg: emailConfirmedSignal,
  resendSuccessMsg: resendSuccessMsgSignal,
  resendSuccess: resendSuccessSignal,
  resendConfirmation: jest.fn(),
};

const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

//#############################//


describe('ConfirmPhoneComponent', () => {
  let component: ConfirmPhoneComponent;
  let fixture: ComponentFixture<ConfirmPhoneComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPhoneComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: AMyIdRouter, useValue: mockRouter },
        { provide: 'ConfirmPhoneStateService', useValue: mockStateService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmPhoneComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    // Don't call detectChanges here - let individual tests control when to trigger change detection
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the confirmed card when _confirmationSuccess() is truthy', () => {
    jest.spyOn(component as any, '_confirmationSuccess').mockReturnValue(true);
    fixture.detectChanges();
    const card = nativeEl.querySelector('sb-confirmed-card');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('show')).toBe(true);
  });

  it('should hide the confirmed card when _confirmationSuccess() is falsy', () => {
    jest.spyOn(component as any, '_confirmationSuccess').mockReturnValue(false);
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
    jest.spyOn(component as any, '_confirmationSuccess').mockReturnValue(false);
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
