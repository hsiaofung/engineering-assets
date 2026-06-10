// resource.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  createResource<T>(url: string, defaultValue: T) {
    const data = signal<T>(defaultValue);
    const isLoading = signal(false);
    const error = signal<string | null>(null);

    const fetch = async () => {
      isLoading.set(true);
      error.set(null);

      // 🧠 cache hit
      if (this.cache.has(url)) {
        data.set(this.cache.get(url));
        isLoading.set(false);
        return;
      }

      try {
        // 🚀 REAL API CALL
        const result = await firstValueFrom(
          this.http.get<T>(url)
        );

        this.cache.set(url, result);
        data.set(result);
      } catch (err: any) {
        error.set(err?.message ?? 'API Error');
      } finally {
        isLoading.set(false);
      }
    };

    // auto fetch (like React Query)
    fetch();

    return {
      data,
      isLoading,
      error,
      refetch: fetch,
    };
  }
}