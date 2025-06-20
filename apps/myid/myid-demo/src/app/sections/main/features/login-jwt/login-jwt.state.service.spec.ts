import { TestBed } from '@angular/core/testing';

import { LoginJwtStateService } from './login-jwt.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginJwtStateService', () => {
  let service: LoginJwtStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        LoginJwtStateService
      ]
    });
    service = TestBed.inject(LoginJwtStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
