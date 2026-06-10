// data-loader.component.ts
import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from './mock-data.service';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [CommonModule],
  exportAs: 'dataLoader', // ✨ 關鍵：允許在 HTML 中使用 #variable="dataLoader"
  template: `<ng-content></ng-content>` // 純資料容器，不帶任何 UI 標籤
})
export class DataLoaderComponent implements OnChanges {
  @Input({ required: true }) url!: string;

  // 定義狀態 Signals
  readonly data = signal<any>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  private dataService = inject(MockDataService);

  // 監聽 url 改變，網址變了就重新抓取
  ngOnChanges(changes: SimpleChanges) {
    if (changes['url']) {
      this.loadData();
    }
  }

  private loadData() {
    this.isLoading.set(true);
    this.error.set(null);

    this.dataService.fetchUrl(this.url).subscribe({
      next: (res) => {
        this.data.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('無法載入資料');
        this.isLoading.set(false);
      }
    });
  }
}