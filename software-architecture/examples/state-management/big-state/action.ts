import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction(
  '[User] Load Users'
);

export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: string[] }>()
);