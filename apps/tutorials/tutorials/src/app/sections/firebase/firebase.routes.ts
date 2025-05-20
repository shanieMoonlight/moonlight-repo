import { Route } from '@angular/router';
import { FirebaseComponent } from './firebase.component';

export const firebaseRoutes: Route[] = [
    {
        path: '',
        component: FirebaseComponent,
        children: [
            {
                path: 'home',
                title: 'Home - SpiderBaby Firebase Tutorials',
                loadComponent: () => import('./features/home/home.component').then(m => m.FirebaseHomeComponent),
            },
            {
                path: 'git-secrets',
                title: 'SpiderBaby Firebase Tutorials - Handling Git Secrets',
                loadComponent: () => import('./features/git-secrets/git-secrets.component').then(m => m.FirebaseGitSecretsComponent),
            },
            {
                path: 'deploy',
                title: 'SpiderBaby Firebase Tutorials - How to Deploy to Firebase Hosting',
                loadComponent: () => import('./features/deploy/deploy.component').then(m => m.FirebaseDeployComponent),
            },
            {
                path: '',
                title: 'SpiderBaby Material Theming - Enhanced Angular Material Design',
                loadComponent: () => import('./features/home/home.component').then(m => m.FirebaseHomeComponent),
            },
            {
                path: '**',
                title: 'Page Not Found - SpiderBaby Material Theming',
                loadComponent: () => import('../../shared/features/not-found.component').then((m) => m.NotFoundComponent),
                pathMatch: 'full',
            },
        ],
    },
];
