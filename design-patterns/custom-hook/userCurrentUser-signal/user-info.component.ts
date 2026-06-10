// user-info.component.ts
import { Component, inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent {
  userService = inject(UserService);

  // direct "hook-like" access
  user = this.userService.user;
  isLoading = this.userService.isLoading;

  constructor() {
    this.userService.loadUser();
  }
}