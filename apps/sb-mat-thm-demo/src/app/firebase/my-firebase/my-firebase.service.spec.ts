import { TestBed } from '@angular/core/testing';

import { MyFirebaseService } from './my-firebase.service';

describe('MyFirebaseService', () => {
  let service: MyFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
