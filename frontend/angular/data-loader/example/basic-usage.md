# DataLoaderComponent 使用範例

一個可重用的 Angular 資料載入元件，使用 **Signals** 管理 loading、error 與 data 狀態。

## 特色
- 支援直接傳入 `url`（自動使用 HttpClient GET）
- 支援自訂 `getFn`（可返回 Observable 或 Promise）
- 使用 Signals 提供響應式狀態
- 透過 `<ng-content>` 進行內容投影，靈活自訂 UI

---

## Core API

### Inputs

- `url?: string`
- `getFn?: () => Observable<T> | Promise<T>`

### State

- `data()`
- `isLoading()`
- `error()`

---

## 基本使用方式

### 1. 和app-data-table-v1組合

```html
<app-data-loader [getFn]="getFilterDataFn" #loader="dataLoader">
  <app-data-table
    [data]="loader.data()?.list"
    [loading]="loader.isLoading()"
  />
```

---

### 2. 使用 `url` 方式（最簡便）

**Template (`my-page.component.html`)**

```html
<app-data-loader #loader="dataLoader" url="https://api.example.com/users">

  <div *ngIf="loader.isLoading()">
    <p>載入中...</p>
  </div>

  <div *ngIf="loader.error()">
    <p style="color: red;">錯誤：{{ loader.error() }}</p>
  </div>

  <ng-container *ngIf="loader.data() as data">
    <h2>使用者列表</h2>
    <ul>
      <li *ngFor="let user of data">{{ user.name }}</li>
    </ul>
  </ng-container>

</app-data-loader>
```

---

### 3. 使用自訂 `getFn` 方式

```html
<app-data-loader 
  #loader="dataLoader"
  [getFn]="fetchUsers">

  <!-- 模板內容同上 -->
</app-data-loader>
```

**Component Class**

```typescript
fetchUsers = () => {
  // 可以是 Observable 或 Promise
  return this.http.get<User[]>('/api/users', { params: { page: 1 } });
  
  // 或使用 Promise
  // return fetch('/api/users').then(res => res.json());
};
```

---

### 4. 同時提供 `url` 與 `getFn`（`getFn` 優先）

```html
<app-data-loader 
  #loader="dataLoader"
  url="/api/old-endpoint"
  [getFn]="customFetch">
```

---

## 完整範例（結合多種狀態處理）

```html
<app-data-loader #loader="dataLoader" url="https://jsonplaceholder.typicode.com/posts">

  <div class="data-container">
    <!-- Loading 狀態 -->
    <div *ngIf="loader.isLoading()" class="loading">
      <mat-spinner></mat-spinner>
      <p>正在載入資料...</p>
    </div>

    <!-- Error 狀態 -->
    <div *ngIf="loader.error() as err" class="error">
      <p>❌ {{ err }}</p>
      <button (click)="loader.executeFetch()">重試</button> <!-- 可自行暴露重試方法 -->
    </div>

    <!-- 資料顯示 -->
    <ng-container *ngIf="loader.data() as posts">
      <h2>文章列表 (共 {{ posts.length }} 筆)</h2>
      <div *ngFor="let post of posts" class="post-card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.body }}</p>
      </div>
    </ng-container>
  </div>

</app-data-loader>
```

---

## 注意事項

1. **exportAs: 'dataLoader'** 讓我們能透過 `#loader="dataLoader"` 取得公開的 signals。
2. 元件會在 `ngOnChanges` 時自動重新抓取資料（`url` 或 `getFn` 改變時）。
3. 目前 `error` 只會顯示簡單錯誤訊息，你可以根據需求修改 `executeFetch` 方法來取得更詳細的錯誤資訊。
4. 支援泛型 `<T>`，TypeScript 會自動推斷資料型別。

---

## 進階：暴露重試功能（可自行擴充）

如果你希望在模板中能呼叫重試，可以在 `DataLoaderComponent` 中新增：

```typescript
retry() {
  this.executeFetch();
}
```

然後在模板中使用：`(click)="loader.retry()"`

---

