// mock-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // 模擬後端 API 請求
  fetchUrl(url: string): Observable<any> {
    if (url.includes('/api/users/123')) {
      return of({ name: '杰倫', email: 'jay@example.com', role: '管理員' }).pipe(delay(1000));
    }
    return of({ error: '找不到資料' }).pipe(delay(1000));
  }
}