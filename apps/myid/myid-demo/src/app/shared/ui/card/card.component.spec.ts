import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MyIdCardComponent } from './card.component';
import { By } from '@angular/platform-browser';

describe('MyIdCardComponent', () => {
  let component: MyIdCardComponent;
  let fixture: ComponentFixture<MyIdCardComponent>;
  let componentRef: ComponentRef<MyIdCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyIdCardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyIdCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the color class', () => {
    componentRef.setInput('color', 'primary');
    fixture.detectChanges();
    let containsClass = fixture.nativeElement.classList.contains('primary');
    expect(containsClass).toBeTruthy();


    componentRef.setInput('color', 'secondary');
    fixture.detectChanges();
    containsClass = fixture.nativeElement.classList.contains('secondary');
    expect(containsClass).toBeTruthy();

    componentRef.setInput('color', 'tertiary');
    fixture.detectChanges();
    containsClass = fixture.nativeElement.classList.contains('tertiary');
    expect(containsClass).toBeTruthy();
  });

  it('should render the content', () => {
    const content = 'This is the content';
    componentRef.setInput('content', content);
    fixture.detectChanges();
    const contentElementContent = fixture.debugElement.nativeElement.querySelector('.card-content')?.textContent;

    expect(contentElementContent).toContain(content);
  })


  it('should render the content', () => {
    const content = 'This is the content';
    componentRef.setInput('content', content);
    fixture.detectChanges();
    const contentElementContent = fixture.debugElement.nativeElement.querySelector('.card-content')?.textContent;

    expect(contentElementContent).toContain(content);
  })

  it('should render the action', () => {

    let actionsElementContent = fixture.debugElement.nativeElement.querySelector('.card-actions')?.textContent;
    expect(actionsElementContent).toContain('EXPLORE');

    const actions = 'This is the actions';
    componentRef.setInput('action', actions);
    fixture.detectChanges();
    actionsElementContent = fixture.debugElement.nativeElement.querySelector('.card-actions')?.textContent;

    expect(actionsElementContent).toContain(actions);
  })



  it('should render the icon', () => {
    fixture.detectChanges();
    let avatarElelment = fixture.debugElement.nativeElement.querySelector('.card-avatar');

    expect(avatarElelment).toBeFalsy();

    const icon = 'home';
    componentRef.setInput('icon', icon);
    fixture.detectChanges();
    avatarElelment = fixture.debugElement.nativeElement.querySelector('.card-avatar');
    expect(avatarElelment).toBeTruthy();


    const avatarElelmentContent = avatarElelment?.textContent;
    expect(avatarElelmentContent).toContain(icon);
  })

  it('should set the routerLink correctly', () => {
    const testRoute = '/test-path';
    componentRef.setInput('route', testRoute);
    fixture.detectChanges();

    // Query the anchor element with [routerLink]
    const anchorDebugEl = fixture.debugElement.query(By.css('a'));
    expect(anchorDebugEl).toBeTruthy();
    expect(anchorDebugEl.attributes['href']).toBe(testRoute);

  });

});
