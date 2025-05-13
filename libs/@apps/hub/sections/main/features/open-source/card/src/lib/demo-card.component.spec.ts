import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubOpenSourceDemoCardComponent } from './demo-card.component';
import { AppImages } from "@sb-hub/core-config/images";
import { DemoAppData } from '@sb-hub/core-config/demo-apps';


describe('OpenSourceDemoCardComponent', () => {
  let component: HubOpenSourceDemoCardComponent;
  let fixture: ComponentFixture<HubOpenSourceDemoCardComponent>;


  const mockDemoApp: DemoAppData = {
    name: 'Material Theming',
    description: 'A powerful, flexible theming system for Angular Material',
    icon: 'palette',
    url: 'https://spiderbabymaterialtheming.web.app',
    image: AppImages.Demos.MatTheme.medium
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubOpenSourceDemoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HubOpenSourceDemoCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('demoApp', "Test Title");
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
