import { TestBed } from '@angular/core/testing';

import { RegisterCustomerStateService } from './register.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ParamMap, convertToParamMap, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

const paramMapSubject: Subject<ParamMap> = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActivatedRoute: Partial<ActivatedRoute> = { paramMap: paramMapSubject.asObservable() };

describe('RegisterCustomerStateService', () => {
  let service: RegisterCustomerStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]

    });
    service = TestBed.inject(RegisterCustomerStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
