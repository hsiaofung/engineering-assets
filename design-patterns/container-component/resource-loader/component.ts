@Component({
  selector: 'app-user',
  template: `
    <ng-container *ngIf="user$ | async as user">
      <app-user-info [user]="user"></app-user-info>
    </ng-container>
  `
})
export class UserComponent {
  user$ = this.resource.get<User>('/api/users/123');

  constructor(private resource: ResourceService) {}
}