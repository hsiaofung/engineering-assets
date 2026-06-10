// user-info.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
  user$ = this.userService.user$;
  loading$ = this.userService.loading$;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.loadUser();
  }
}