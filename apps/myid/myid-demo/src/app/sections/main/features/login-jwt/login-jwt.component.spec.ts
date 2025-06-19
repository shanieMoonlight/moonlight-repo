import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginJwtComponent } from './login-jwt.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountIoService } from '../../../../shared/io/services';
import { SocialAuthService, SocialAuthServiceConfig, } from '@abacritt/angularx-social-login';

//##############################//


const mockSocialAuthServiceConfig: SocialAuthServiceConfig = {
  autoLogin: true,
  lang: 'en-Ie',
  providers: [],
  onError: (error: any) => console.error('SocialAuthService Error:', error)
}

//##############################//


describe('LoginJwtComponent', () => {

  let component: LoginJwtComponent;
  let fixture: ComponentFixture<LoginJwtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginJwtComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SocialAuthService,
        AccountIoService,
        {
          provide: 'SocialAuthServiceConfig',
          useValue: mockSocialAuthServiceConfig
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginJwtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
