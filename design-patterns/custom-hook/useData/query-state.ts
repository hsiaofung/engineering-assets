// query-state.ts

import { Signal } from '@angular/core';

export interface QueryState<T> {
  data: Signal<T | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  load(): Promise<void>;
  refresh(): Promise<void>;
}