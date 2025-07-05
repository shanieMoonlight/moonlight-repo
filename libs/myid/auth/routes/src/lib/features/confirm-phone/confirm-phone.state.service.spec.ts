import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPhoneStateService } from './confirm-phone.state.service';
import { of } from 'rxjs';

//###############################//


const mockActRoute = {
  queryParamMap: of({ get: () => null })
}


//###############################//

describe('ConfirmPhoneStateService', () => {
  let service: ConfirmPhoneStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmPhoneStateService,
        { provide: ActivatedRoute, useValue: mockActRoute} 
      ]
    });
    service = TestBed.inject(ConfirmPhoneStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
