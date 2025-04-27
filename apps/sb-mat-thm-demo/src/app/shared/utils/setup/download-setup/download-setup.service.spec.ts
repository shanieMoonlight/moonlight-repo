import { TestBed } from '@angular/core/testing';

import { DownloadSetupService } from './download-setup.service';

describe('DownloadSetupService', () => {
  let service: DownloadSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
