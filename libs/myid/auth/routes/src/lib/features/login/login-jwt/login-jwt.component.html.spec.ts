/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginJwtComponent } from './login-jwt.component';
import { of } from 'rxjs';
import { SbButtonGoogleLoginComponent } from '../buttons/google/btn-google-login.component';
import { LoginJwtStateService } from './login-jwt.state.service';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MyIdRouter } from '@spider-baby/myid-auth/config';

@Component({ selector: 'sb-button-google-login', standalone: true, template: '' })
class StubGoogleButton {}

@Component({ selector: 'sb-button-facebook-login', standalone: true, template: '' })
class StubFacebookButton {}

@Component({ selector: 'sb-button-amazon-login', standalone: true, template: '' })
class StubAmazonButton {}

const mockActRoute = {
  queryParamMap: of({ get: () => null }),
  data: of({ showSocialLinks: true })
}

const mockSocialAuth = { authState: of(null), signOut: jest.fn() };
const mockRouter = { navigateToLogin: jest.fn(), navigateToHome: jest.fn() };

describe('LoginJwtComponent (template)', () => {
  let fixture: ComponentFixture<LoginJwtComponent>;

  it('renders google button when showGoogle is true and hides others', async () => {
    const mockState = {
      showGoogleLogin: () => true,
      showFacebookLogin: () => false,
      showAmazonLogin: () => false,
      successMsg: () => '', errorMsg: () => '', loading: () => false,
      login: jest.fn(), forgotPassword: jest.fn(), loginGoogle: jest.fn(),
      loginSuccess: () => false,
      twoFactorData: () => undefined,
      redirectUrl: () => null
    };

    TestBed.overrideComponent(LoginJwtComponent, { set: { providers: [{ provide: LoginJwtStateService, useValue: mockState }] } });
    TestBed.overrideComponent(SbButtonGoogleLoginComponent, { set: { template: '' } });

    await TestBed.configureTestingModule({
      imports: [LoginJwtComponent, StubGoogleButton, StubFacebookButton, StubAmazonButton],
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: MyIdRouter, useValue: mockRouter },
        provideHttpClient(), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginJwtComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('sb-button-google-login')).toBeTruthy();
    expect(el.querySelector('sb-button-facebook-login')).toBeNull();
    expect(el.querySelector('sb-button-amazon-login')).toBeNull();
  });

  it('hides all provider buttons when show signals are false', async () => {
    const mockState2 = {
      showGoogleLogin: () => false,
      showFacebookLogin: () => false,
      showAmazonLogin: () => false,
      successMsg: () => '', errorMsg: () => '', loading: () => false,
      login: jest.fn(), forgotPassword: jest.fn(), loginGoogle: jest.fn(),
      loginSuccess: () => false,
      twoFactorData: () => undefined,
      redirectUrl: () => null
    };

    TestBed.overrideComponent(LoginJwtComponent, { set: { providers: [{ provide: LoginJwtStateService, useValue: mockState2 }] } });
    TestBed.overrideComponent(SbButtonGoogleLoginComponent, { set: { template: '' } });

    await TestBed.configureTestingModule({
      imports: [LoginJwtComponent, StubGoogleButton, StubFacebookButton, StubAmazonButton],
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: MyIdRouter, useValue: mockRouter },
        provideHttpClient(), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginJwtComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('sb-button-google-login')).toBeNull();
    expect(el.querySelector('sb-button-facebook-login')).toBeNull();
    expect(el.querySelector('sb-button-amazon-login')).toBeNull();
  });

  it('renders facebook button when showFacebook is true', async () => {
    const mockStateFb = {
      showGoogleLogin: () => false,
      showFacebookLogin: () => true,
      showAmazonLogin: () => false,
      successMsg: () => '', errorMsg: () => '', loading: () => false,
      login: jest.fn(), forgotPassword: jest.fn(), loginGoogle: jest.fn(),
      loginSuccess: () => false,
      twoFactorData: () => undefined,
      redirectUrl: () => null
    };

    TestBed.overrideComponent(LoginJwtComponent, { set: { providers: [{ provide: LoginJwtStateService, useValue: mockStateFb }] } });
    TestBed.overrideComponent(SbButtonGoogleLoginComponent, { set: { template: '' } });

    await TestBed.configureTestingModule({
      imports: [LoginJwtComponent, StubGoogleButton, StubFacebookButton, StubAmazonButton],
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: MyIdRouter, useValue: mockRouter },
        provideHttpClient(), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginJwtComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('sb-button-google-login')).toBeNull();
    expect(el.querySelector('sb-button-facebook-login')).toBeTruthy();
    expect(el.querySelector('sb-button-amazon-login')).toBeNull();
  });

  it('renders amazon button when showAmazon is true', async () => {
    const mockStateAm = {
      showGoogleLogin: () => false,
      showFacebookLogin: () => false,
      showAmazonLogin: () => true,
      successMsg: () => '', errorMsg: () => '', loading: () => false,
      login: jest.fn(), forgotPassword: jest.fn(), loginGoogle: jest.fn(),
      loginSuccess: () => false,
      twoFactorData: () => undefined,
      redirectUrl: () => null
    };

    TestBed.overrideComponent(LoginJwtComponent, { set: { providers: [{ provide: LoginJwtStateService, useValue: mockStateAm }] } });
    TestBed.overrideComponent(SbButtonGoogleLoginComponent, { set: { template: '' } });

    await TestBed.configureTestingModule({
      imports: [LoginJwtComponent, StubGoogleButton, StubFacebookButton, StubAmazonButton],
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: MyIdRouter, useValue: mockRouter },
        provideHttpClient(), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginJwtComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('sb-button-google-login')).toBeNull();
    expect(el.querySelector('sb-button-facebook-login')).toBeNull();
    expect(el.querySelector('sb-button-amazon-login')).toBeTruthy();
  });
});
