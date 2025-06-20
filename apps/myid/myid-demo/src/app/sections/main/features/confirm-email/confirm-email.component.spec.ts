import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountIoService } from '../../../../shared/io/services';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmEmailStateService } from './confirm-email.state.service';


//###############################//

const mockStateService = {
  resend: jest.fn(),
  successMsg: () => 'Success message', // or whatever value you want
  errorMsg: () => 'Error message',
  loading: () => false, // or true, depending on your test
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}


//###############################//
describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmEmailStateService, useValue: mockStateService },
        { provide: ActivatedRoute, useValue: mockActRoute} // <-- Add this line
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
