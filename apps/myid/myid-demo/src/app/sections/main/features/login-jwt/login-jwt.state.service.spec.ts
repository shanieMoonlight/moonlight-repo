import { TestBed } from '@angular/core/testing';

import { LoginJwtStateService } from './login-jwt.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';

//#############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
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
