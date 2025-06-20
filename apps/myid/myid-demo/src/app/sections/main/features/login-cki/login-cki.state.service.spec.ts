import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginCkiStateService } from './login-cki.state.service';

describe('LoginCkiStateService', () => {
  let service: LoginCkiStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        LoginCkiStateService
      ]
    });
    service = TestBed.inject(LoginCkiStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
