import { TestBed } from '@angular/core/testing';

import { AlertAndNotifyService } from './alert-and-notify.service';

describe('AlertAndNotifyService', () => {
  let service: AlertAndNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertAndNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
