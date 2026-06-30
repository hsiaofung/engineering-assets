import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from './store/user.actions';
import * as UserSelectors from './store/user.selectors';

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <button (click)="loadUsers()">
      Load Users
    </button>

    @if (loading$ | async) {
      <p>Loading...</p>
    }

    <ul>
      @for (user of users$ | async; track user) {
        <li>{{ user }}</li>
      }
    </ul>
  `
})
export class UsersComponent {
  private store = inject(Store);

  users$ = this.store.select(UserSelectors.selectUsers);

  loading$ = this.store.select(UserSelectors.selectLoading);

  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }
}