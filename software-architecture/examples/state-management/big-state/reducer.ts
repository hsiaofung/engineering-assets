import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  users: string[];
  loading: boolean;
}

export const initialState: UserState = {
  users: [],
  loading: false
};

export const userReducer = createReducer(
  initialState,

  on(UserActions.loadUsers, state => ({
    ...state,
    loading: true
  })),

  on(UserActions.loadUsersSuccess, (state, action) => ({
    ...state,
    users: action.users,
    loading: false
  }))
);