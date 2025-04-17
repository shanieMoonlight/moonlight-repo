import { TestBed } from '@angular/core/testing';

import { ThemeGeneratorService } from './theme-generator.service';

describe('ThemeGeneratorService', () => {
  let service: ThemeGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
