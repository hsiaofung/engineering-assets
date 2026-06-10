import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isObservable, Observable, from } from 'rxjs';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  exportAs: 'dataLoader',
  template: `<ng-content></ng-content>`
})
export class DataLoaderComponent implements OnChanges{
  // 支援兩種輸入方式
  @Input() url?: string;
  @Input() getFn?: () => Observable<any> | Promise<any>;

  readonly data = signal<any>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  private http = inject(HttpClient);

  ngOnChanges(changes: SimpleChanges) {
    // 無論是 url 變了還是 getFn 變了，都觸發重新抓取
    if (changes['url'] || changes['getFn']) {
      this.executeFetch();
    }
  }

  private executeFetch() {
    let finalTargetFn: (() => Observable<any> | Promise<any>) | undefined = this.getFn;

    // 🌟 核心魔術：如果使用者只傳 url，自動在內部包裝成標準的 getFn
    if (this.url && !finalTargetFn) {
      finalTargetFn = () => this.http.get(this.url!);
    }

    if (!finalTargetFn) {
      this.error.set('未提供有效的 url 或 getFn');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const result = finalTargetFn();
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
    } catch (err) {
      this.error.set('執行錯誤');
      this.isLoading.set(false);
    }
  }
}