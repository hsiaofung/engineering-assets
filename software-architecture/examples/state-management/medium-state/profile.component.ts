import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [(ngModel)]="name"
      placeholder="Enter name"
    />

    <button (click)="save()">
      Save
    </button>
  `
})
export class ProfileComponent {
  userService = inject(UserService);

  name = '';

  save(): void {
    this.userService.updateName(this.name);
  }
}