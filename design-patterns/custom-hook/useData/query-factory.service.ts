// query-factory.service.ts

import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class QueryFactory {
  create<T>(getData: () => Promise<T>) {
    const data = signal<T | null>(null);
    const isLoading = signal(false);
    const error = signal<string | null>(null);

    const load = async () => {
      try {
        isLoading.set(true);
        error.set(null);

        const result = await getData();

        data.set(result);
      } catch (e: any) {
        error.set(e?.message ?? "Unknown Error");
      } finally {
        isLoading.set(false);
      }
    };

    load();

    return {
      data,
      isLoading,
      error,
      load,
      refresh: load,
    };
  }
}
