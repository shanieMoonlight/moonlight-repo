import { TestBed } from '@angular/core/testing';
import { SeasonsComponent } from './seasons.component';
import { RouterModule } from '@angular/router';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';

describe('SeasonsComponent', () => {
  
  let component: SeasonsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeasonsComponent, 
        RouterModule.forRoot([])
      ],
      providers: [DynamicThemeConfigService], // Provide the IconsService
    }).compileComponents();

    
    const fixture = TestBed.createComponent(SeasonsComponent);
    component = fixture.componentInstance;
  });

  it('should inject IconsService', () => {
    expect(component['dynamicConfigService']).toBeInstanceOf(DynamicThemeConfigService);
  });

});
