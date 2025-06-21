import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmEmailStateService } from './confirm-email.state.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

//###############################//


const mockActRoute = {
  queryParamMap: of({ get: () => null })
}


//###############################//

describe('ConfirmEmailStateService', () => {
  let service: ConfirmEmailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmEmailStateService,
        { provide: ActivatedRoute, useValue: mockActRoute} 
        
      ]
    });
    service = TestBed.inject(ConfirmEmailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
