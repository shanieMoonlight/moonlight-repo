import { TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';

describe('MainComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });



  it(`should have as title 'mat-theme-demo'`, () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mat-theme-demo');
  });
});
