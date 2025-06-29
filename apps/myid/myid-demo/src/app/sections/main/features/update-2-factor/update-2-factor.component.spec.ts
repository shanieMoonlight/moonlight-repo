import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Update2FactorComponent } from './update-2-factor.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ParamMap, convertToParamMap, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

const paramMapSubject: Subject<ParamMap> = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActivatedRoute: Partial<ActivatedRoute> = { paramMap: paramMapSubject.asObservable() };

describe('Update2FactorComponent', () => {
  let component: Update2FactorComponent;
  let fixture: ComponentFixture<Update2FactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Update2FactorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Update2FactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
