import { inject } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';



export const appViewTransition = {
    onViewTransitionCreated: ({ transition }: any) => {
        const router = inject(Router);
        const targetUrl = router.currentNavigation()!.finalUrl!;
        // Skip the transition if the only thing
        // changing is the fragment and queryParams
        const config: IsActiveMatchOptions = {
            paths: 'exact',
            matrixParams: 'exact',
            fragment: 'ignored',
            queryParams: 'ignored',
        };
        if (router.isActive(targetUrl, config)) {
            transition.skipTransition();
        }
    },
}