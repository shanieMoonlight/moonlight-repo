import { TestBed } from '@angular/core/testing';

import { IdNavigationService } from './id-navigation.service';

describe('IdNavigationService', () => {
  let service: IdNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
