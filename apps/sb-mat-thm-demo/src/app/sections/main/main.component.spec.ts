import { TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { IconsService } from './utils/icons/icons.service';

// describe('MainComponent', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [MainComponent, RouterModule.forRoot([])],
//     }).compileComponents();
//   });


// });
describe('MainComponent', () => {
  let component: MainComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, RouterModule.forRoot([])],
      providers: [IconsService], // Provide the IconsService
    }).compileComponents();

    const fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should inject IconsService', () => {
    expect(component.iconsService).toBeInstanceOf(IconsService);
  });
});