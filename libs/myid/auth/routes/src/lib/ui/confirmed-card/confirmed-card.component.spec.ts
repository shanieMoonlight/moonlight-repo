import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmedCardComponent } from './confirmed-card.component';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MyIdRouter } from '@spider-baby/myid-auth/utils';

//#############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

//#############################//

describe('EmailConfirmedCardComponent', () => {
  let component: ConfirmedCardComponent;
  let fixture: ComponentFixture<ConfirmedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmedCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MyIdRouter, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
