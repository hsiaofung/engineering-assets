{
  path: 'users/:id',
  component: UserPageComponent,
  resolve: { user: UserResolver }
}