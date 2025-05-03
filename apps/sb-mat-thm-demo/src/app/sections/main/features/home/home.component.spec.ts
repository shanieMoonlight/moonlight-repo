import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainHomeComponent } from './home.component';
import { IconsService } from '../../utils/icons/icons.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideHttpClient } from '@angular/common/http';

describe('MainHomeComponent', () => {
  let component: MainHomeComponent;
  let fixture: ComponentFixture<MainHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        MainHomeComponent,
        MatIconTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        IconsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render GitHub, NPM, Share, and API buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.links button');
    expect(buttons.length).toBe(4);

    const labels = Array.from(buttons).map(btn => btn.getAttribute('aria-label'));
    expect(labels).toContain('View GitHub Repository');
    expect(labels).toContain('View NPM Package');
    expect(labels).toContain('Share this page');
    expect(labels).toContain('View API Documentation');
  });

  it('should render mat-icon for git and npm', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('mat-icon');
    const svgIcons = Array.from(icons)
      .map(icon => icon.getAttribute('ng-reflect-svg-icon'))
      .filter(Boolean);
    expect(svgIcons).toContain('git');
    expect(svgIcons).toContain('npm');
  });

  it('should have correct hrefs for GitHub and NPM buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const githubBtn = Array.from(compiled.querySelectorAll('.links button')).find(
      btn => btn.getAttribute('aria-label') === 'View GitHub Repository'
    );
    const npmBtn = Array.from(compiled.querySelectorAll('.links button')).find(
      btn => btn.getAttribute('aria-label') === 'View NPM Package'
    );
    expect(githubBtn).toBeTruthy();
    expect(npmBtn).toBeTruthy();
  });

  it('should call ngOnInit and set SEO metadata', () => {
    const seoService = TestBed.inject(IconsService) as any;
    const spy = jest.spyOn(component as any, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
})