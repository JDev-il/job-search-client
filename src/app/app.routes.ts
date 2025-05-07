import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loadGuard } from './core/guards/load.guard';
import { AuthResolver } from './shared/services/resolver.service';

export const routes: Routes = [

  // Public Routes: Login and Register
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/pages/login/login.component').then((c) => c.LoginComponent),
    canActivate: [loadGuard]
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./shared/pages/registration/registration.component').then((c) => c.RegistrationComponent),
    canActivate: [loadGuard]
  },

  // Protected Routes
  {
    path: '',
    loadComponent: () =>
      import('./shared/pages/layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard],
    resolve: {
      auth: AuthResolver
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./pages/activity-table/activity-table.component').then((c) => c.ActivityTableComponent)
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./shared/pages/my-account/my-account.component').then((c) => c.MyAccountComponent),
        canActivate: [authGuard]
      },
    ],
  },

  // Undefined Paths
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then((c) => c.NotFoundComponent)
  },
];
