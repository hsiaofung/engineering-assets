import { Component, inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <h3>User: {{ userService.userName() }}</h3>
  `
})
export class NavbarComponent {
  userService = inject(UserService);
}