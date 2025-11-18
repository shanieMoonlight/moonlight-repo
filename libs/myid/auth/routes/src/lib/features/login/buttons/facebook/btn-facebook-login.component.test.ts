import { Injector, runInInjectionContext } from '@angular/core';
import { SbButtonFacebookLoginComponent } from './btn-facebook-login.component';
import { SocialAuthService, SocialUser, FacebookLoginProvider } from '@abacritt/angularx-social-login';

describe('SbButtonFacebookLoginComponent', () => {
    let mockAuthService: Partial<SocialAuthService>;
    let injector: Injector;

    beforeEach(() => {
        mockAuthService = {
            signIn: jest.fn()
        };
        injector = Injector.create({
            providers: [
                { provide: SocialAuthService, useValue: mockAuthService }
            ]
        });
    });

  //--------------------------//

    it('should instantiate the component in an injection context', () => {
        const component = runInInjectionContext(injector, () => new SbButtonFacebookLoginComponent());
        expect(component).toBeDefined();
        // defaults from input(...) should be present
        expect(component.faceBookIconSvg).toBeDefined();
        expect(typeof component.faceBookIconSvg()).toBe('string');
        expect(component.faceBookIconSvg()).toContain('<svg');
        expect(component.showTooltip).toBeTruthy();
    });

  //--------------------------//

    it('login() should call SocialAuthService.signIn and emit the social user', async () => {
        const fakeUser: SocialUser = {
            provider: FacebookLoginProvider.PROVIDER_ID,
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            photoUrl: '',
            firstName: '',
            lastName: '',
            authToken: '',
            idToken: '',
            authorizationCode: ''
        } as SocialUser;

        (mockAuthService.signIn as jest.Mock).mockResolvedValue(fakeUser);

        const component = runInInjectionContext(injector, () => new SbButtonFacebookLoginComponent());

        // Replace the runtime output with a spyable emitter-like object
        component.socialUser = { emit: jest.fn() } as any;

        await (component as any).login();

        expect(mockAuthService.signIn).toHaveBeenCalledWith(FacebookLoginProvider.PROVIDER_ID);
        expect((component.socialUser as any).emit).toHaveBeenCalledWith(fakeUser);
    });
});