// user.component.ts
import { Component, inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent {
  userService = inject(UserService);

  userQuery = this.userService.useUser('123');
}