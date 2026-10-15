import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics').then((m) => m.Analytics),
      },
      {
        path: 'charts',
        loadComponent: () => import('./pages/charts/charts').then((m) => m.Charts),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar').then((m) => m.Calendar),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then((m) => m.Users),
      },
      {
        path: 'people',
        loadComponent: () => import('./pages/people/people').then((m) => m.People),
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'subcategories',
        loadComponent: () =>
          import('./pages/subcategories/subcategories').then((m) => m.Subcategories),
      },
      {
        path: 'furniture',
        loadComponent: () => import('./pages/furniture/furniture').then((m) => m.Furniture),
      },
      {
        path: 'furniture/:id/configuration',
        loadComponent: () =>
          import('./pages/furniture-configuration/furniture-configuration').then(
            (m) => m.FurnitureConfiguration,
          ),
      },
      {
        path: 'parameters',
        loadComponent: () => import('./pages/parameters/parameters').then((m) => m.Parameters),
      },
      {
        path: 'system-constants',
        loadComponent: () =>
          import('./pages/system-constants/system-constants').then((m) => m.SystemConstants),
      },
      {
        path: 'complementary-articles',
        loadComponent: () =>
          import('./pages/complementary-articles/complementary-articles').then(
            (m) => m.ComplementaryArticles,
          ),
      },
      {
        path: 'melamine-colors',
        loadComponent: () => import('./pages/melamine-colors/melamine-colors').then((m) => m.MelamineColors),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  {
    path: 'demo',
    loadComponent: () => import('./pages/demo/demo').then((m) => m.Demo),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/customer-catalog/customer-catalog').then((m) => m.CustomerCatalog),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
