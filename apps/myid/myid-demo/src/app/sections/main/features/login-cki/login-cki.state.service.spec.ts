import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LoginCkiStateService } from './login-cki.state.service';


//#############################//

const mockActRoute = {
  queryParamMap: of({ get: () => null }),
  data: of({ get: () => null })
}

//#############################//

describe('LoginCkiStateService', () => {
  let service: LoginCkiStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        LoginCkiStateService
      ]
    });
    service = TestBed.inject(LoginCkiStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
