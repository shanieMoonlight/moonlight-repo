import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPhoneComponent } from './confirm-phone.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountIoService } from '../../../../shared/io/services';

describe('ConfirmPhoneComponent', () => {
  let component: ConfirmPhoneComponent;
  let fixture: ComponentFixture<ConfirmPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPhoneComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AccountIoService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
