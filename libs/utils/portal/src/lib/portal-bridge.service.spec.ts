import { TestBed } from '@angular/core/testing';

import { SbPortalBridgeService } from './portal-bridge.service';

describe('NavPortalService', () => {
  let service: SbPortalBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbPortalBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
