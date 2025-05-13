import { TestBed } from '@angular/core/testing';

import { HubNavigationService } from './hub-navigation.service';

describe('PublicNavigationService', () => {
  let service: HubNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
