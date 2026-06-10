// user.service.ts
import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource-mock.service';

export interface User {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private resource = inject(ResourceService);

  useUser(userId: string) {
    return this.resource.createResource<User>(
      `/users/${userId}`,
      { id: userId, name: '' }
    );
  }

  useCurrentUser() {
    const id = this.getCurrentUserId();
    return this.useUser(id);
  }

  private getCurrentUserId() {
    return '789'; // mock localStorage/token
  }
}