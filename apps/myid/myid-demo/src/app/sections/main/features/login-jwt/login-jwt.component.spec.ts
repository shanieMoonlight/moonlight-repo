/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { LoginService } from '../../../../shared/auth/services/login/login.service';
import { AccountIoService } from '@spider-baby/myid-io';
import { LoginJwtComponent } from './login-jwt.component';
import { LoginJwtStateService } from './login-jwt.state.service';

//##############################//



// Integration-style test: mock dependencies of LoginJwtStateService, not the service itself
const mockAccountIoService = {
  forgotPassword: jest.fn(() => of({ message: 'Forgot password success' }))
};
const mockLoginService = {
  loginJwt: jest.fn(() => of({ jwt: 'token' })),
  loginGoogleJwt: jest.fn(() => of({ jwt: 'google-token' }))
};


// Remove unused mockStateService
const mockState = {
  forgotPassword: jest.fn(),
  login: jest.fn(),
  loginGoogle: jest.fn(),
  successMsg: () => 'Success message',
  errorMsg: () => 'Error message',
  loading: () => false,
  loginSuccess: () => false,
};


const mockSocialAuthServiceConfig = {
  autoLogin: true,
  lang: 'en-Ie',
  providers: [],
  onError: (error: Error) => console.error('SocialAuthService Error:', error)
}

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

const mockRouter = {
  navigateToLogin: jest.fn(),
  navigateToHome: jest.fn()
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

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

describe('LoginJwtComponent', () => {
  let component: LoginJwtComponent;
  let fixture: ComponentFixture<LoginJwtComponent>;
  let stateService: LoginJwtStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginJwtComponent, MockGoogleSigninButtonDirective],
      providers: [
        { provide: AccountIoService, useValue: mockAccountIoService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: MyIdRouter, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: 'SocialAuthServiceConfig', useValue: mockSocialAuthServiceConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginJwtComponent);
    component = fixture.componentInstance;
    stateService = fixture.debugElement.injector.get(LoginJwtStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login() should call state.login with dto', () => {
    const spy = jest.spyOn(stateService, 'login');
    const dto = { email: 'a', password: 'b' };
    component.login(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('onForgotPwd() should set _showForgotPwd to true', () => {
    component.onForgotPwd();
    expect(component['_showForgotPwd']()).toBe(true);
  });

  it('onForgotPasswordResult() should call state.forgotPassword', () => {
    const spy = jest.spyOn(stateService, 'forgotPassword');
    const dto = { email: 'a@b.com' };
    component.onForgotPasswordResult(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
  });

  it('should call loginGoogle on social authState emit', () => {
    const spy = jest.spyOn(stateService, 'loginGoogle');
    // Emit after spy is attached and component is ready
    authStateSubject.next({ id: '123', name: 'Test User' });
    expect(spy).toHaveBeenCalledWith({ id: '123', name: 'Test User' });
  });

  // For loginSuccess, you may need to mock the computed signal if needed
  // or test the effect by triggering the state change in the service's dependencies

  it('should hide forgot password modal by default', () => {
    expect(component['_showForgotPwd']()).toBe(false);
  });
});