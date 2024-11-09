import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loadGuard } from './core/guards/load.guard';

export const routes: Routes = [
  // Public Routes: Login and Register
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/pages/login/login.component').then((c) => c.LoginComponent),
    canActivate: [loadGuard], // Redirects logged-in users to the dashboard if token is present
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./shared/pages/registration/registration.component').then((c) => c.RegistrationComponent),
    canActivate: [loadGuard], // Allows access to registration for all users, redirecting logged-in users if necessary
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./shared/pages/my-account/my-account.component').then((c) => c.MyAccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    // This route is accessible by all users
  },
  // Protected Routes: Dashboard and Activity Table
  {
    path: '',
    loadComponent: () =>
      import('./shared/pages/layout/layout.component').then((c) => c.LayoutComponent),
    canActivate: [authGuard], // Restricts access to authenticated users only
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./pages/activity-table/activity-table.component').then((c) => c.ActivityTableComponent),
      },
    ],
  },
  // Fallback Route for Undefined Paths
  {
    path: '**',
    redirectTo: 'not-found', // Redirects to a dedicated NotFound component
  },
];
