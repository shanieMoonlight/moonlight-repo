import { TestBed } from '@angular/core/testing';

import { SuperTeamStateService } from './super-team.state.service';
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

describe('SuperTeamStateService', () => {
  let service: SuperTeamStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        SuperTeamStateService
      ]});
    service = TestBed.inject(SuperTeamStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
