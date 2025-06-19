import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountIoService } from '../../../../shared/io/services';
import { Verify2FactorComponent } from './verify-2-factor.component';

describe('Verify2FactorComponent', () => {
  let component: Verify2FactorComponent;
  let fixture: ComponentFixture<Verify2FactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify2FactorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AccountIoService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Verify2FactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
