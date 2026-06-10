// user-query.service.ts

import { Injectable, inject } from "@angular/core";
import { QueryFactory } from "./query-factory.service";
import { UserApiService } from "./user-api.service";

@Injectable({
  providedIn: "root",
})
export class UserQueryService {
  private queryFactory = inject(QueryFactory);
  private userApi = inject(UserApiService);

  useUser(userId: string) {
    return this.queryFactory.create(() => this.userApi.getUser(userId));
  }
}
