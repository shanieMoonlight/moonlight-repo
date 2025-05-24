import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { SbHubPkgLinksComponent } from './pkg-links.component';
import { SbNavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';

describe('SbHubPkgLinksComponent', () => {
  let fixture: ComponentFixture<SbHubPkgLinksComponent>;
  let component: SbHubPkgLinksComponent;
  let nativeElement: HTMLElement;
  let loader: HarnessLoader;

  const GITHUB_BUTTON_SELECTOR = 'button[aria-label="Git repo for project"]';
  const NPM_BUTTON_SELECTOR = 'button[aria-label="Npm Package"]';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SbHubPkgLinksComponent, // Import the standalone component directly
        SbNavigateNewWindowDirective, // Import the standalone directive
        MatIconTestingModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SbHubPkgLinksComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Button Rendering', () => {
    it('should not render any buttons if no URLs are provided', () => {
      fixture.detectChanges(); // Initial state, no inputs set
      expect(nativeElement.querySelector(GITHUB_BUTTON_SELECTOR)).toBeNull();
      expect(nativeElement.querySelector(NPM_BUTTON_SELECTOR)).toBeNull();
    });

    it('should render only GitHub button when only gitHubRepoUrl is provided', () => {
      fixture.componentRef.setInput('gitHubRepoUrl', 'https://github.com/test');
      fixture.detectChanges();
      const gitButton = nativeElement.querySelector(GITHUB_BUTTON_SELECTOR);
      const npmButton = nativeElement.querySelector(NPM_BUTTON_SELECTOR);
      expect(gitButton).not.toBeNull();
      expect(npmButton).toBeNull();
    });

    it('should render only NPM button when only npmPackageUrl is provided', () => {
      fixture.componentRef.setInput('npmPackageUrl', 'https://npmjs.com/test');
      fixture.detectChanges();
      const gitButton = nativeElement.querySelector(GITHUB_BUTTON_SELECTOR);
      const npmButton = nativeElement.querySelector(NPM_BUTTON_SELECTOR);
      expect(gitButton).toBeNull();
      expect(npmButton).not.toBeNull();
    });

    it('should render both buttons when both URLs are provided', () => {
      fixture.componentRef.setInput('gitHubRepoUrl', 'https://github.com/test');
      fixture.componentRef.setInput('npmPackageUrl', 'https://npmjs.com/test');
      fixture.detectChanges();
      const gitButton = nativeElement.querySelector(GITHUB_BUTTON_SELECTOR);
      const npmButton = nativeElement.querySelector(NPM_BUTTON_SELECTOR);
      expect(gitButton).not.toBeNull();
      expect(npmButton).not.toBeNull();
    });
  });

  describe('GitHub Button', () => {
    it('should display if _gitHubRepoUrl is provided', () => {
      fixture.componentRef.setInput('gitHubRepoUrl', 'https://github.com/example');
      fixture.detectChanges();
      const button = nativeElement.querySelector(GITHUB_BUTTON_SELECTOR);
      expect(button).toBeTruthy();
      const icon = button?.querySelector('mat-icon');
      expect(icon?.getAttribute('svgIcon')).toBe('git');
    });

    it('should not display if _gitHubRepoUrl is not provided', () => {
      fixture.componentRef.setInput('gitHubRepoUrl', undefined);
      fixture.detectChanges();
      expect(nativeElement.querySelector(GITHUB_BUTTON_SELECTOR)).toBeNull();
    });

    it('should bind _gitHubRepoUrl to SbNavigateNewWindowDirective', () => {
      const testUrl = 'https://github.com/test';
      fixture.componentRef.setInput('gitHubRepoUrl', testUrl);
      fixture.detectChanges();
      const buttonEl = fixture.debugElement.query(By.css(GITHUB_BUTTON_SELECTOR));
      const directiveInstance = buttonEl.injector.get(SbNavigateNewWindowDirective);
      expect(directiveInstance.link()).toBe(testUrl);
    });

    it('should display default gitTooltip', async () => {
      fixture.componentRef.setInput('gitHubRepoUrl', 'https://github.com/example');
      // _gitTooltip has a default value of 'Git repo'
      fixture.detectChanges();
      
      // Get the tooltip harness for the specific button
      const gitTooltip = await loader.getHarness(MatTooltipHarness.with({
        selector: GITHUB_BUTTON_SELECTOR
      }));
      
      // Show the tooltip and verify text
      await gitTooltip.show();
      expect(await gitTooltip.getTooltipText()).toBe('Git repo');
      await gitTooltip.hide();
    });

    it('should display custom gitTooltip', async () => {
      const customTooltip = 'Custom Git Link';
      fixture.componentRef.setInput('gitHubRepoUrl', 'https://github.com/example');
      fixture.componentRef.setInput('gitTooltip', customTooltip);

      console.log(`Setting custom gitTooltip: ${customTooltip}`);
      
      fixture.detectChanges();
      
      // Get the tooltip harness for the specific button
      const gitTooltip = await loader.getHarness(MatTooltipHarness.with({
        selector: GITHUB_BUTTON_SELECTOR
      }));
      
      // Show the tooltip and verify text
      await gitTooltip.show();
      expect(await gitTooltip.getTooltipText()).toBe(customTooltip);
      await gitTooltip.hide();
    });
  });

  describe('NPM Button', () => {
    it('should display if _npmPackageUrl is provided', () => {
      fixture.componentRef.setInput('npmPackageUrl', 'https://npmjs.com/package/example');
      fixture.detectChanges();
      const button = nativeElement.querySelector(NPM_BUTTON_SELECTOR);
      expect(button).toBeTruthy();
      const icon = button?.querySelector('mat-icon');
      expect(icon?.getAttribute('svgIcon')).toBe('npm');
    });

    it('should not display if _npmPackageUrl is not provided', () => {
      fixture.componentRef.setInput('npmPackageUrl', undefined);
      fixture.detectChanges();
      expect(nativeElement.querySelector(NPM_BUTTON_SELECTOR)).toBeNull();
    });

    it('should bind _npmPackageUrl to SbNavigateNewWindowDirective', () => {
      const testUrl = 'https://npmjs.com/package/test';
      fixture.componentRef.setInput('npmPackageUrl', testUrl);
      fixture.detectChanges();
      const buttonEl = fixture.debugElement.query(By.css(NPM_BUTTON_SELECTOR));
      const directiveInstance = buttonEl.injector.get(SbNavigateNewWindowDirective);
      expect(directiveInstance.link()).toBe(testUrl);
    });

    it('should display default npmTooltip', async () => {
      fixture.componentRef.setInput('npmPackageUrl', 'https://npmjs.com/package/example');
      // _npmTooltip has a default value of 'Npm Package'
      fixture.detectChanges();
      
      // Get the tooltip harness for the specific button
      const npmTooltip = await loader.getHarness(MatTooltipHarness.with({
        selector: NPM_BUTTON_SELECTOR
      }));
      
      // Show the tooltip and verify text
      await npmTooltip.show();
      expect(await npmTooltip.getTooltipText()).toBe('Npm Package');
      await npmTooltip.hide();
    });

    it('should display custom npmTooltip', async () => {
      const customTooltip = 'Custom NPM Link';
      fixture.componentRef.setInput('npmPackageUrl', 'https://npmjs.com/package/example');
      fixture.componentRef.setInput('npmTooltip', customTooltip);
      fixture.detectChanges();
      
      // Get the tooltip harness for the specific button
      const npmTooltip = await loader.getHarness(MatTooltipHarness.with({
        selector: NPM_BUTTON_SELECTOR
      }));
      
      // Show the tooltip and verify text
      await npmTooltip.show();
      expect(await npmTooltip.getTooltipText()).toBe(customTooltip);
      await npmTooltip.hide();
    });
  });

  describe('hoverColor Input', () => {
    it('should apply hoverColor to host style', () => {
      const testColor = 'rgb(255, 0, 0)'; // Use a specific format like rgb for reliable comparison
      fixture.componentRef.setInput('hoverColor', testColor);
      fixture.detectChanges();
      expect(nativeElement.style.getPropertyValue('--hoverColor')).toBe(testColor);
    });

    it('should not set --hoverColor if hoverColor input is not provided', () => {
      fixture.detectChanges(); // No hoverColor input
      expect(nativeElement.style.getPropertyValue('--hoverColor')).toBe(''); // Or check for absence
    });
  });
});
