import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmEmailStateService } from './confirm-email.state.service';

describe('ConfirmEmailStateService', () => {
  let service: ConfirmEmailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmEmailStateService
      ]
    });
    service = TestBed.inject(ConfirmEmailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
