import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailWithPwdComponent } from './confirm-email-with-pwd.component';
import { ConfirmEmailWithPwdStateService } from './confirm-email-with-pwd.state.service';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

//###############################//

const mockStateService = {
  confirmEmail: jest.fn(),
  successMsg: () => 'Success message', // or whatever value you want
  errorMsg: () => 'Error message',
  loading: () => false, // or true, depending on your test
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}


//###############################//

describe('ConfirmEmailWithPwdComponent', () => {
  let component: ConfirmEmailWithPwdComponent;
  let fixture: ComponentFixture<ConfirmEmailWithPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailWithPwdComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmEmailWithPwdStateService, useValue: mockStateService },
        { provide: ActivatedRoute, useValue: mockActRoute} // <-- Add this line
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailWithPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
