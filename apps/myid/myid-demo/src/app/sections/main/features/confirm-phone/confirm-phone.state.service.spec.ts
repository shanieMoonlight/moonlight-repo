import { TestBed } from '@angular/core/testing';

import { ConfirmPhoneStateService } from './confirm-phone.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ConfirmPhoneStateService', () => {
  let service: ConfirmPhoneStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmPhoneStateService
      ]
    });
    service = TestBed.inject(ConfirmPhoneStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
