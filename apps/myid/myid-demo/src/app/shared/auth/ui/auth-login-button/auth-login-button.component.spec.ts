import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { SbAuthLoginButtonComponent } from './auth-login-button.component';

//###############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
  navigateToHome: jest.fn()
};

// Use a BehaviorSubject for queryParamMap, so we can update it in each test
const queryParamMapSubject = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActRoute: Partial<ActivatedRoute> = {
  // snapshot: {},
  params: of({}),
  get queryParamMap() {
    return queryParamMapSubject.asObservable();
  }
};


//###############################//

describe('AuthLoginButtonComponent', () => {
  let component: SbAuthLoginButtonComponent;
  let fixture: ComponentFixture<SbAuthLoginButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbAuthLoginButtonComponent],
          providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MyIdRouter, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SbAuthLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
