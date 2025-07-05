/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCustomerComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ComponentRef, Directive, Input } from '@angular/core';
import { RegisterCustomerStateService } from './register.state.service';


const paramMapSubject: Subject<ParamMap> = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActivatedRoute: Partial<ActivatedRoute> = { 
  paramMap: paramMapSubject.asObservable() ,
  data: of({ get: () => null })
};

//#######################//

// Remove unused mockStateService
const mockState = {
  login: jest.fn(),
  loginGoogle: jest.fn(),
  successMsg: () => 'Success message',
  errorMsg: () => 'Error message',
  loading: () => false,
  loginSuccess: () => false,
};

const authStateSubject = new Subject<any>();
const mockSocialAuth = {
  authState: authStateSubject.asObservable(),
  signInState: new Subject(),
  initState: new Subject(),
  getAuthState: jest.fn().mockReturnValue(of(null)),
  signIn: jest.fn(),
  signOut: jest.fn()
};

const mockSocialAuthServiceConfig = {
  autoLogin: true,
  lang: 'en-Ie',
  providers: [],
  onError: (error: Error) => console.error('SocialAuthService Error:', error)
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

describe('RegisterComponent', () => {
  let component: RegisterCustomerComponent;
  let componentRef: ComponentRef<RegisterCustomerComponent>;
  let stateService: RegisterCustomerStateService;
  let fixture: ComponentFixture<RegisterCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterCustomerComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SocialAuthService, useValue: mockSocialAuth },
        { provide: RegisterCustomerStateService, useValue: mockState },
        { provide: 'SocialAuthServiceConfig', useValue: mockSocialAuthServiceConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCustomerComponent);
    component = fixture.componentInstance;
    stateService = fixture.debugElement.injector.get(RegisterCustomerStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log('stateService:', stateService);

    expect(component).toBeTruthy();
  });


  it('login() should call state.login with dto', () => {
    const spy = jest.spyOn(stateService, 'register');
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      password: 'pA$$Word1',
      confirmPassword: 'pA$$Word1',
    };
    (component as any).register(dto as any);
    expect(spy).toHaveBeenCalledWith(dto);
  });

});
