import { TestBed } from '@angular/core/testing';

import { JsonIoService } from './json-io.service';

describe('JsonIoService', () => {
  let service: JsonIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
