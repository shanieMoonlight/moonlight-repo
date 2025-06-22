import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Verify2FactorComponent } from './verify-2-factor.component';
import { Verify2FactorStateService } from './verify-2-factor.state.service';

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
  let component: Verify2FactorComponent;
  let fixture: ComponentFixture<Verify2FactorComponent>;
  let state: Verify2FactorStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify2FactorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: Verify2FactorStateService, useValue:  mockStateService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Verify2FactorComponent);
    component = fixture.componentInstance;
    state = TestBed.inject(Verify2FactorStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
