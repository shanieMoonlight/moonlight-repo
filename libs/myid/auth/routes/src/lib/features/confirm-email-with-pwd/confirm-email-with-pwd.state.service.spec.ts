import { TestBed } from '@angular/core/testing';

import { ConfirmEmailWithPwdStateService } from './confirm-email-with-pwd.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

//###############################//

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}


//###############################//
describe('ConfirmEmailWithPwdStateService', () => {
  let service: ConfirmEmailWithPwdStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmEmailWithPwdStateService,
        { provide: ActivatedRoute, useValue: mockActRoute} 
      ]
    });
    service = TestBed.inject(ConfirmEmailWithPwdStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
