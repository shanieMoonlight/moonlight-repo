import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MptNavbar } from './nav';

describe('MptNavbar', () => {
  let fixture: ComponentFixture<MptNavbar>;
  let component: MptNavbar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MptNavbar, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MptNavbar);
    component = fixture.componentInstance;
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders default title and logo', () => {
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img.logo'))?.nativeElement as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('alt')).toBe('logo');

    const titleEl = fixture.debugElement.query(By.css('.center .title'))?.nativeElement as HTMLElement;
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent?.trim()).toBe('Empathy Test');
  });

  it('accepts `logo` and `title` inputs', () => {
    const testLogo = '/assets/test-logo.png';
    const testTitle = 'My App';
    fixture.componentRef.setInput('logo', testLogo);
    fixture.componentRef.setInput('title', testTitle);
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img.logo'))?.nativeElement as HTMLImageElement;
    expect(img.src).toContain(testLogo);

    const titleEl = fixture.debugElement.query(By.css('.center .title'))?.nativeElement as HTMLElement;
    expect(titleEl.textContent?.trim()).toBe(testTitle);
  });
});
