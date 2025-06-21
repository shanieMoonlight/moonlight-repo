import { TestBed } from '@angular/core/testing';

import { MyIdFallbackRouter } from './id-router.service';

describe('MyIdFallbackRouter', () => {
  let service: MyIdFallbackRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyIdFallbackRouter]
      
    });
    service = TestBed.inject(MyIdFallbackRouter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
