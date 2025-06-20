import { TestBed } from '@angular/core/testing';

import { ConfirmEmailWithPwdStateService } from './confirm-email-with-pwd.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ConfirmEmailWithPwdStateService', () => {
  let service: ConfirmEmailWithPwdStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmEmailWithPwdStateService
      ]
    });
    service = TestBed.inject(ConfirmEmailWithPwdStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
