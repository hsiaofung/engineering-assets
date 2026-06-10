// user-info.component.ts

import { Component, inject } from "@angular/core";
import { UserQueryService } from "./user-query.service";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
})
export class UserInfoComponent {
  private userQueryService = inject(UserQueryService);

  query = this.userQueryService.useUser("123");
}
