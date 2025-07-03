import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { LoginJwtStateService } from './login-jwt.state.service';

//#############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null }),
  data: of({ get: () => null })
}

//#############################//

describe('LoginJwtStateService', () => {
  let service: LoginJwtStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MyIdRouter, useValue: mockRouter },
        LoginJwtStateService
      ]
    });
    service = TestBed.inject(LoginJwtStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
