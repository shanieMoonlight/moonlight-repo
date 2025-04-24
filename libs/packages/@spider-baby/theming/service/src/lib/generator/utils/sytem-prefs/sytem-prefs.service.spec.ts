import { TestBed } from '@angular/core/testing';

import { SystemPrefsService } from './sytem-prefs.service';

describe('SystemPrefsService', () => {
  let service: SystemPrefsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemPrefsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
