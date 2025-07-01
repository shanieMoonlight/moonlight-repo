import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbProgressBarComponent } from './progress-bar.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

// Helper to get fill div
function getFill(fixture: ComponentFixture<SbProgressBarComponent>) {
    return fixture.debugElement.query(By.css('.sb-progress-bar-fill'));
}

describe('SbProgressBarComponent', () => {
    let fixture: ComponentFixture<SbProgressBarComponent>;
    let component: SbProgressBarComponent;
    let componentRef: ComponentRef<SbProgressBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SbProgressBarComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(SbProgressBarComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render determinate progress with correct width', () => {
        componentRef.setInput('mode', 'determinate');
        componentRef.setInput('value', 42);
        fixture.detectChanges();
        const fill = getFill(fixture);
        expect(fill.styles['width']).toBe('42%');
    });

    it('should render indeterminate progress with width 100%', () => {
        componentRef.setInput('mode', 'indeterminate');
        componentRef.setInput('value', 0);
        fixture.detectChanges();
        const fill = getFill(fixture);
        expect(fill.styles['width']).toBe('100%');
    });

    it('should update width when value changes in determinate mode', () => {
        componentRef.setInput('mode', 'determinate');
        componentRef.setInput('value', 10);
        fixture.detectChanges();
        let fill = getFill(fixture);
        expect(fill.styles['width']).toBe('10%');
        componentRef.setInput('value', 80);
        fixture.detectChanges();
        fill = getFill(fixture);
        expect(fill.styles['width']).toBe('80%');
    });

    it('should apply indeterminate class when mode is indeterminate', () => {
        componentRef.setInput('mode', 'indeterminate');
        fixture.detectChanges();
        const host = fixture.debugElement.nativeElement;
        expect(host.classList).toContain('indeterminate');
    });

    it('should not apply indeterminate class when mode is determinate', () => {
        componentRef.setInput('mode', 'determinate');
        fixture.detectChanges();
        const host = fixture.debugElement.nativeElement;
        expect(host.classList).not.toContain('indeterminate');
    });
});
