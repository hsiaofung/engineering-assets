import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(m => m.HomeComponent),
  },

  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component')
        .then(m => m.UsersComponent),
  },

  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.component')
        .then(m => m.ReportsComponent),
  },
]