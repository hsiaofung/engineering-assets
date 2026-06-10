// data-loader.component.ts
import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { isObservable, Observable, from } from 'rxjs';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  exportAs: 'dataLoader',
  template: `<ng-content></ng-content>`
})
export class DataLoaderComponent implements OnChanges {
  // ✨ 核心進化：傳入一個函數
  @Input({ required: true }) getDataFn!: () => Observable<any> | Promise<any>;

  readonly data = signal<any>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['getDataFn']) {
      this.executeFetch();
    }
  }

  private executeFetch() {
    if (!this.getDataFn) return;

    this.isLoading.set(true);
    this.error.set(null);

    // 呼叫傳進來的函數
    const result = this.getDataFn();

    // 統一轉換成 RxJS Observable 處理（不管原本是 Promise 還是 Observable）
    const observable$ = isObservable(result) ? result : from(result);

    observable$.subscribe({
      next: (res) => {
        this.data.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('資料載入失敗');
        this.isLoading.set(false);
      }
    });
  }
}