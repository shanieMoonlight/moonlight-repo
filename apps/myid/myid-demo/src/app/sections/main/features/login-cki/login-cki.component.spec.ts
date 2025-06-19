import { SocialAuthService, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountIoService } from '../../../../shared/io/services';
import { LoginCkiComponent } from './login-cki.component';

//##############################//


const mockSocialAuthServiceConfig: SocialAuthServiceConfig = {
  autoLogin: true,
  lang: 'en-Ie',
  providers: [],
  onError: (error: any) => console.error('SocialAuthService Error:', error)
}

//##############################//

describe('LoginCkiComponent', () => {
  let component: LoginCkiComponent;
  let fixture: ComponentFixture<LoginCkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCkiComponent],
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

    fixture = TestBed.createComponent(LoginCkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
