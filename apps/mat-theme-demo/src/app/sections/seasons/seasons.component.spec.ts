import { TestBed } from '@angular/core/testing';
import { SeasonsComponent } from './seasons.component';
import { RouterModule } from '@angular/router';

describe('SeasonsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonsComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });


});
