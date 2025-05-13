import { TestBed } from '@angular/core/testing';

import { HubRouterUtilsService } from './hub-navigation.service';

describe('HubRouterUtilsService', () => {
  let service: HubRouterUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubRouterUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
