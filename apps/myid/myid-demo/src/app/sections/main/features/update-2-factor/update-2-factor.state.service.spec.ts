import { TestBed } from '@angular/core/testing';

import { Update2FactorStateService } from './update-2-factor.state.service';

describe('Update2FactorStateService', () => {
  let service: Update2FactorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Update2FactorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
