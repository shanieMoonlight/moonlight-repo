import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Verify2FactorCookieComponent } from './verify-2-factor-cki.component';
import { Verify2FactorCookieStateService } from './verify-2-factor-cki.state.service';

//###############################//

const mockStateService = {
  verify2Factor: jest.fn(),
  resend2Factor: jest.fn(),
  successMsg: () => 'Success message', // or whatever value you want
  errorMsg: () => 'Error message',
  loading: () => false, // or true, depending on your test
};


const mockActRoute = {
  snapshot: {},
  params: of({}),
  queryParamMap: of({ get: () => null })
}


//###############################//

describe('Verify2FactorComponent', () => {
  let component: Verify2FactorCookieComponent;
  let fixture: ComponentFixture<Verify2FactorCookieComponent>;
  let state: Verify2FactorCookieStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify2FactorCookieComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: Verify2FactorCookieStateService, useValue:  mockStateService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Verify2FactorCookieComponent);
    component = fixture.componentInstance;
    state = TestBed.inject(Verify2FactorCookieStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
