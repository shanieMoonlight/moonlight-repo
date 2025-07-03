/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEAM_COLORS, TeamBadgeComponent } from './team-badge.component';
import { MyIdAuthService } from '../../../id/auth/services/auth/myid-auth.browser.service';
import { ComponentRef, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

class MockAuthService {
    teamType = signal('super');
    isLoggedIn = signal(true);
}

describe('TeamBadgeComponent', () => {
    let component: TeamBadgeComponent;
    let fixture: ComponentFixture<TeamBadgeComponent>;
    let componentRef: ComponentRef<TeamBadgeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeamBadgeComponent],
            providers: [
                { provide: MyIdAuthService, useClass: MockAuthService }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TeamBadgeComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the team type if logged in', () => {
        expect((component as any)._teamType()).toBe('super');
    });


    it('should use correct badge styles for known team types', () => {
        (component as any)._auth.teamType.set('maintenance');
        fixture.detectChanges();

        expect((component as any)._badgeStyles().background).toBe(TEAM_COLORS['maintenance'].background);


        (component as any)._auth.teamType.set('customer');
        fixture.detectChanges();

        expect((component as any)._badgeStyles().background).toBe(TEAM_COLORS['customer'].background);


        (component as any)._auth.teamType.set('super');
        fixture.detectChanges();

        expect((component as any)._badgeStyles().background).toBe(TEAM_COLORS['super'].background);
    });


    it('should use default badge styles for unknown team types', () => {
        (component as any)._auth.teamType.set('unknown');
        expect((component as any)._badgeStyles().background).toBe(TEAM_COLORS['default'].background);
    });


    it('should NOT render badge when NOT logged in ', () => {
        (component as any)._auth.isLoggedIn.set(false);
        fixture.detectChanges();
        const badge = fixture.debugElement.queryAll(By.css(`.team-badge`));
        console.log('badge', badge);
        
        expect((component as any)._isLoggedIn()).toBe(false);
        expect(badge.length).toBe(0);
    });

    it('should render badge when logged in ', () => {
        (component as any)._auth.isLoggedIn.set(true);
        fixture.detectChanges();
        const badge = fixture.debugElement.queryAll(By.css(`.team-badge`));
        expect((component as any)._isLoggedIn()).toBe(true);
        expect(badge.length).toBe(1);
    });


      it('should render teamType name ', () => {
       (component as any)._auth.teamType.set('maintenance');
        fixture.detectChanges();

        let badge = fixture.debugElement.query(By.css(`.team-badge`));
        expect(badge.nativeElement?.textContent).toContain('Maintenance');


        (component as any)._auth.teamType.set('customer');
        fixture.detectChanges();

         badge = fixture.debugElement.query(By.css(`.team-badge`));
        expect(badge.nativeElement?.textContent).toContain('Customer');


        (component as any)._auth.teamType.set('super');
        fixture.detectChanges();

         badge = fixture.debugElement.query(By.css(`.team-badge`));
        expect(badge.nativeElement?.textContent).toContain('Super');
    });


});
