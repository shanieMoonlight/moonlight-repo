import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Verify2FactorStateService } from './verify-2-factor.state.service';

describe('Verify2FactorStateService', () => {
  let service: Verify2FactorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        Verify2FactorStateService
      ]
    });
    service = TestBed.inject(Verify2FactorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
