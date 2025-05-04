import { TestBed } from '@angular/core/testing';
import { FirebaseComponent } from './firebase.component';
import { RouterModule } from '@angular/router';
import { IconsService } from './utils/icons/icons.service';



// });
describe('MainComponent', () => {
  let component: FirebaseComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseComponent, RouterModule.forRoot([])],
      providers: [IconsService], // Provide the IconsService
    }).compileComponents();

    const fixture = TestBed.createComponent(FirebaseComponent);
    component = fixture.componentInstance;
  });

  it('should inject IconsService', () => {
    expect(component.iconsService).toBeInstanceOf(IconsService);
  });
});