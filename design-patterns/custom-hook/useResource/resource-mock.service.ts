// resource.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private cache = new Map<string, any>();

  createResource<T>(url: string, defaultValue: T) {
    const data = signal<T>(defaultValue);
    const isLoading = signal(false);

    const fetch = async () => {
      isLoading.set(true);

      // 🧠 cache hit
      if (this.cache.has(url)) {
        data.set(this.cache.get(url));
        isLoading.set(false);
        return;
      }

      console.log('loading data from:', url);

      // 🧪 mock API (replace with HttpClient in real app)
      const result: any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ url, mock: true });
        }, 800);
      });

      this.cache.set(url, result);
      data.set(result);
      isLoading.set(false);
    };

    fetch();

    return {
      data,
      isLoading,
      refetch: fetch,
    };
  }
}