// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(userId: number) {
    // 實際上會呼叫 API
    return this.http.get(`/api/users/${userId}`);
  }

  getMockUser(userId: number) {
    return of({
      id: userId,
      name: 'Sean',
      age: 123,
      hairColor: 'brown',
      hobbies: ['code', 'food']
    });
  }
}