// user-api.ts
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

export function getServerData(url: string): () => Observable<any> {
  // 這裡利用 inject(HttpClient) 或是直接從全域獲取
  // 為了範例簡單，我們回傳一個閉包函數
  return () => {
    const http = inject(HttpClient); 
    return http.get(url).pipe(delay(1000));
  };
}