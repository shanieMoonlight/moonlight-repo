import { TestBed } from '@angular/core/testing';
import { ApiComponent } from './api.component';
import { RouterModule } from '@angular/router';

describe('MainComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });



  it(`should have as title 'mat-theme-demo'`, () => {
    const fixture = TestBed.createComponent(ApiComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mat-theme-demo');
  });
});
