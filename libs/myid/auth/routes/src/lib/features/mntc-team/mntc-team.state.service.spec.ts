import { TestBed } from '@angular/core/testing';

import { MntcTeamStateService } from './mntc-team.state.service';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

//#############################//


const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

//#############################//

describe('MntcTeamStateService', () => {
  let service: MntcTeamStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        MntcTeamStateService
      ]});
    service = TestBed.inject(MntcTeamStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
