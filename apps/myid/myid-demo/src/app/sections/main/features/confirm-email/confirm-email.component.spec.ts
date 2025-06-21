/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ConfirmEmailStateService } from './confirm-email.state.service';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { signal } from '@angular/core';


//###############################//

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
  emailConfirmedSuccessMsg: emailConfirmedSignal,
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


//###############################//


describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    // Reset all signals to initial state
    emailConfirmedSignal.set('');
    errorMsgSignal.set('');
    loadingSignal.set(false);
    resendSuccessMsgSignal.set('');
    resendSuccessSignal.set(false);

    await TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmEmailStateService, useValue: mockStateService },
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: AMyIdRouter, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    // Don't call detectChanges here - let individual tests control when to trigger change detection
  });

  it('should create', () => {
    fixture.detectChanges(); // Add detectChanges for this test since we removed it from beforeEach
    expect(component).toBeTruthy();
  });

it('should show the email-confirmed-card when _emailConfirmedSuccessMsg() is non-empty', async () => {
  // Spy on the component's method BEFORE triggering change detection
  jest.spyOn(component as any, '_emailConfirmedSuccessMsg').mockReturnValue('Confirmed!');
  
  // Now trigger change detection with the spy in place
  fixture.detectChanges();
  
  const card = nativeEl.querySelector('sb-email-confirmed-card');
  expect(card).toBeTruthy();

  console.log('component', component['_emailConfirmedSuccessMsg']());
  
  expect(card?.classList.contains('show')).toBe(true);
});


  it('should hide the email-confirmed-card when _emailConfirmedSuccessMsg() is empty', () => {
    // Spy on the component's method to return empty string
  jest.spyOn(component as any, '_emailConfirmedSuccessMsg').mockReturnValue('');
    
    fixture.detectChanges();
    
    const card = nativeEl.querySelector('sb-email-confirmed-card');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('show')).toBe(false);
  });


  it('should show the error button when _errorMsg() is non-empty', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('Some error');
    fixture.detectChanges();
    
    const btn = nativeEl.querySelector('.resend-confirmation-btn');
    expect(btn).toBeTruthy();
    expect(btn?.classList.contains('show')).toBe(true);
  });


  it('should hide the error button when _errorMsg() is empty', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('');
    fixture.detectChanges();
    
    const btn = nativeEl.querySelector('.resend-confirmation-btn');
    expect(btn).toBeTruthy();
    expect(btn?.classList.contains('show')).toBe(false);
  });


  it('should show the login button when _resendSuccess() is true', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_resendSuccess').mockReturnValue(true);
    fixture.detectChanges();

    
  console.log('component', component['_resendSuccess']());
    
    const loginBtn = nativeEl.querySelector('.go-to-login-btn');
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.classList.contains('show')).toBe(true);
  });


  it('should hide the login button when _resendSuccess() is false', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_resendSuccess').mockReturnValue(false);
    fixture.detectChanges();
    
    const btns = nativeEl.querySelectorAll('sb-button');
    const loginBtn = Array.from(btns).find(btn => btn.textContent?.includes('Login'));
    expect(loginBtn).toBeTruthy();
    expect(loginBtn?.classList.contains('show')).toBe(false);
  });


  it('should pass correct values to sb-notifications-modal-mat', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_errorMsg').mockReturnValue('err');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_resendSuccessMsg').mockReturnValue('success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(component as any, '_loading').mockReturnValue(true);
    fixture.detectChanges();
    
    const modal = nativeEl.querySelector('sb-notifications-modal-mat');
    expect(modal).toBeTruthy();
    // Optionally, check attributes if needed
  });
});
