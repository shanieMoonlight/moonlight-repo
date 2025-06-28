import { TestBed } from '@angular/core/testing';

import { UpdateSelfStateService } from './update-self.state.service';

describe('UpdateSelfStateService', () => {
  let service: UpdateSelfStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateSelfStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
