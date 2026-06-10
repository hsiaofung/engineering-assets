@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<User> {
  constructor(private http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.http.get<User>(
      `/api/users/${route.params['id']}`
    );
  }
}