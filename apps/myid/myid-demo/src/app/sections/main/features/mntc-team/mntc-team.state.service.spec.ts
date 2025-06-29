import { TestBed } from '@angular/core/testing';

import { MntcTeamStateService } from './mntc-team.state.service';

describe('MntcTeamStateService', () => {
  let service: MntcTeamStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MntcTeamStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
