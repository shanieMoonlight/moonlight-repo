import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ResetPwdComponent } from './reset-pwd.component';
import { ResetPwdStateService } from './reset-pwd.state.service';

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

describe('ResetPwdComponent', () => {
  let component: ResetPwdComponent;
  let fixture: ComponentFixture<ResetPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPwdComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ResetPwdStateService, useValue: mockStateService },
        { provide: ActivatedRoute, useValue: mockActRoute} // <-- Add this line
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
