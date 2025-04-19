import { TestBed } from '@angular/core/testing';

import { SytemPrefsService } from './sytem-prefs.service';

describe('SytemPrefsService', () => {
  let service: SytemPrefsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SytemPrefsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
