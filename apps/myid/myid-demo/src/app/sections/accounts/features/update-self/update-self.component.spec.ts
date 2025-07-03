import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateSelfComponent } from './update-self.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

const paramMapSubject: Subject<ParamMap> = new BehaviorSubject<ParamMap>(convertToParamMap({}));
const mockActivatedRoute: Partial<ActivatedRoute> = { paramMap: paramMapSubject.asObservable() };

describe('UpdateSelfComponent', () => {
  let component: UpdateSelfComponent;
  let fixture: ComponentFixture<UpdateSelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpdateSelfComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
