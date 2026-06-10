// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor() {}

  loadUser() {
    this.loadingSubject.next(true);

    // 模擬 API call
    setTimeout(() => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
      };

      this.userSubject.next(mockUser);
      this.loadingSubject.next(false);
    }, 1000);
  }
}