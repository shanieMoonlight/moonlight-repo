import { TestBed } from '@angular/core/testing';

import { AnimationFrameService } from './animation-frame.service';

describe('AnimationFrameService', () => {
  let service: AnimationFrameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationFrameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
