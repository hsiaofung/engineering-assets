import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userName = signal('Tom');

  updateName(name: string): void {
    this.userName.set(name);
  }
}