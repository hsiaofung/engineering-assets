// user-info.component.ts
@Component({
  selector: 'app-user-info',
  standalone: true,
  template: `...`
})
export class UserInfoComponent implements OnInit {
  @Input() userId!: number;
  user: any = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getMockUser(this.userId).subscribe(data => {
      this.user = data;
    });
  }
}