import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePwdComponent } from './change-pwd.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountIoService } from '../../../../shared/io/services';

describe('ChangePwdComponent', () => {
  let component: ChangePwdComponent;
  let fixture: ComponentFixture<ChangePwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePwdComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AccountIoService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
