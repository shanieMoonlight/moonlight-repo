import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangePwdStateService } from './change-pwd.state.service';

describe('ChangePwdStateService', () => {
  let service: ChangePwdStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ChangePwdStateService
      ]
    });
    service = TestBed.inject(ChangePwdStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
