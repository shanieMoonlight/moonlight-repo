import { TestBed } from '@angular/core/testing';

import { UpdateSelfStateService } from './update-self.state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ParamMap, convertToParamMap, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

const paramMapSubject: Subject<ParamMap> = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActivatedRoute: Partial<ActivatedRoute> = { paramMap: paramMapSubject.asObservable() };

describe('UpdateSelfStateService', () => {
  let service: UpdateSelfStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]

    });
    service = TestBed.inject(UpdateSelfStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
