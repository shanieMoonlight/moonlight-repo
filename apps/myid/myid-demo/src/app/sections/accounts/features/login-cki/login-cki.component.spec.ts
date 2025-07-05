/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { LoginCkiComponent } from './login-cki.component';
import { LoginCkiStateService } from './login-cki.state.service';
import { ActivatedRoute } from '@angular/router';

//##############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
  navigateToHome: jest.fn()
};

const mockActRoute = {
  queryParamMap: of({ get: () => null }),
  data: of({ get: () => null })
}

const mockStateService = {
  loginCookie: jest.fn(),
  forgotPassword: jest.fn(),
  loginGoogleCookie: jest.fn(),
  successMsg: () => 'Success',
  errorMsg: () => 'Error',
  loading: () => false,
  loginSuccess: () => false,
};

const mockSocialAuthServiceConfig = {
  autoLogin: true,
  lang: 'en-Ie',
  providers: [],
  onError: (error: Error) => console.error('SocialAuthService Error:', error)
};

// SocialAuthService mock
const authStateSubject = new Subject<any>();
const mockSocialAuth = {
  authState: authStateSubject.asObservable(),
  signInState: new Subject(),
  initState: new Subject(),
  getAuthState: jest.fn().mockReturnValue(of(null)),
  signIn: jest.fn(),
  signOut: jest.fn()
};

// Mock for asl-google-signin-button directive
@Directive({
  selector: 'asl-google-signin-button',
  standalone: true
})
class MockGoogleSigninButtonDirective {
  @Input() type: 'icon' | 'standard' = 'icon';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input() text: 'signin_with' | 'signup_with' | 'continue_with' = 'signin_with';
  @Input() shape: 'square' | 'circle' | 'pill' | 'rectangular' = 'rectangular';
  @Input() theme: 'outline' | 'filled_blue' | 'filled_black' = 'outline';
  @Input() logo_alignment: 'left' | 'center' = 'left';
  @Input() width: number = 0;
  @Input() locale: string = 'en';
}

//##############################//

describe('LoginCkiComponent', () => {
  let component: LoginCkiComponent;
  let fixture: ComponentFixture<LoginCkiComponent>;
  let stateService: LoginCkiStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCkiComponent, MockGoogleSigninButtonDirective],
      providers: [
        { provide: LoginCkiStateService, useValue: mockStateService },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: MyIdRouter, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: 'SocialAuthServiceConfig', useValue: mockSocialAuthServiceConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCkiComponent);
    component = fixture.componentInstance;
    stateService = fixture.debugElement.injector.get(LoginCkiStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login() should call state.loginCookie with dto', () => {
    const spy = jest.spyOn(stateService, 'loginCookie');
    const dto = { email: 'a', password: 'b' };
    component.login(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('onForgotPwdClick() should set _showForgotPwd to true', () => {
    component.onForgotPwdClick();
    expect(component['_showForgotPwd']()).toBe(true);
  });

  it('onForgotPasswordResult() should call state.forgotPassword', () => {
    const spy = jest.spyOn(stateService, 'forgotPassword');
    const dto = { email: 'a@b.com' };
    component.onForgotPasswordResult(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should call loginGoogleCookie on social authState emit', () => {
    const spy = jest.spyOn(stateService, 'loginGoogleCookie');
    authStateSubject.next({ id: '123', name: 'Test User' });
    expect(spy).toHaveBeenCalledWith({ id: '123', name: 'Test User' });
  });

  it('should hide forgot password modal by default', () => {
    expect(component['_showForgotPwd']()).toBe(false);
  });
});
