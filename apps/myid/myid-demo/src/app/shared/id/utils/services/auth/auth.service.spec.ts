import { TestBed } from '@angular/core/testing';

import { AuthTeamsService } from './auth.service';

describe('AuthService', () => {
  let service: AuthTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
