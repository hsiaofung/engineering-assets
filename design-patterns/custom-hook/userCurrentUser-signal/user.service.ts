// user.service.ts
import { Injectable, signal } from '@angular/core';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  // state (like useState)
  user = signal<User | null>(null);
  isLoading = signal<boolean>(false);

  constructor() {}

  loadUser() {
    this.isLoading.set(true);

    // simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
      };

      this.user.set(mockUser);
      this.isLoading.set(false);
    }, 1000);
  }
}