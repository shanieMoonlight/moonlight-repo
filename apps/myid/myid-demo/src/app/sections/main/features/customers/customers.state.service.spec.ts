import { TestBed } from '@angular/core/testing';

import { CustomersStateService } from './customers.state.service';
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

describe('CustomersStateService', () => {
  let service: CustomersStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        CustomersStateService
      ]});
    service = TestBed.inject(CustomersStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
