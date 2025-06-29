import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScratchpadComponent } from './scratchpad.component';
import { SocialAuthSetup } from '../../../../config/oauth.config';
import { AccountIoService } from '@spider-baby/myid-io';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OauthComponent', () => {
  let component: ScratchpadComponent;
  let fixture: ComponentFixture<ScratchpadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScratchpadComponent],
      providers:[
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting(), // Provide testing support
        SocialAuthSetup.provideSocialLoginConfig(),
        AccountIoService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScratchpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
