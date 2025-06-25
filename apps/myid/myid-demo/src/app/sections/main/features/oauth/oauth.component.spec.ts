import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OauthComponent } from './oauth.component';
import { SocialAuthSetup } from '../../../../config/oauth.config';
import { AccountIoService } from '../../../../shared/id/io/services/account.io.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OauthComponent', () => {
  let component: OauthComponent;
  let fixture: ComponentFixture<OauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthComponent],
      providers:[
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting(), // Provide testing support
        SocialAuthSetup.provideSocialLoginConfig(),
        AccountIoService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
