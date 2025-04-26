import { TestBed } from '@angular/core/testing';

import { SbNotificationStatusService } from './alert-and-notify-status.service';

describe('AlertAndNotifyStatusService', () => {
  let service: SbNotificationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbNotificationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
