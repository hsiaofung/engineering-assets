@Injectable({ providedIn: 'root' })
export class ResourceService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}