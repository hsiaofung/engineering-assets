export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/users-page.component')
        .then(m => m.UsersPageComponent),
  },
]