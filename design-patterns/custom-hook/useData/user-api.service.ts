// user-api.service.ts

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserApiService {
  private http = inject(HttpClient);

  getUser(id: string) {
    return firstValueFrom(this.http.get<User>(`/api/users/${id}`));
  }
}
